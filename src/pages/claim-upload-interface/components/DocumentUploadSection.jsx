import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../utils/supabaseClient';

const DocumentUploadSection = ({ onFilesChange, uploadedFiles = [], isUploading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  }, []);

  const handleFiles = async (files) => {
    const fileArray = Array.from(files || []);

    const validFiles = fileArray?.filter(file => {
      const isPdf = file?.type === 'application/pdf';
      const isImage = file?.type?.startsWith('image/');
      const isZip = file?.type === 'application/zip' || file?.name?.toLowerCase()?.endsWith('.zip');
      const isGeoJson = file?.type === 'application/geo+json' || file?.type === 'application/json' || file?.name?.toLowerCase()?.endsWith('.geojson');
      const isKml = file?.type === 'application/vnd.google-earth.kml+xml' || file?.name?.toLowerCase()?.endsWith('.kml');
      const isValidType = isPdf || isImage || isZip || isGeoJson || isKml;
      const isValidSize = file?.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });

    if (!validFiles?.length) return;

    const uploadedMeta = [];

    for (let index = 0; index < validFiles.length; index++) {
      const file = validFiles[index];
      const fileId = `${file?.name}-${index}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulated progress ticker (to keep UI responsive)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev?.[fileId] || 0;
          if (current >= 90) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [fileId]: Math.min(current + 10, 90) };
        });
      }, 200);

      let publicUrl = null;
      let storagePath = null;
      try {
        const bucket = 'fra-uploads';
        const path = `claims/${Date.now()}_${file?.name}`;
        storagePath = path;
        const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
          contentType: file?.type || 'application/octet-stream',
          cacheControl: '3600',
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        publicUrl = urlData?.publicUrl || null;
      } catch (e) {
        console.warn('Storage upload failed (continuing locally):', e?.message || e);
      } finally {
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      }

      uploadedMeta.push({
        name: file?.name,
        size: file?.size,
        type: file?.type,
        url: publicUrl,
        storagePath,
      });
    }

    onFilesChange(uploadedMeta);
  };

  const removeFile = (fileIndex) => {
    const newFiles = uploadedFiles?.filter((_, index) => index !== fileIndex);
    onFilesChange(newFiles);
  };

  const getFileIcon = (file) => {
    if (file?.type === 'application/pdf') return 'FileText';
    if (file?.type?.startsWith('image/')) return 'Image';
    if (file?.type === 'application/zip' || file?.name?.toLowerCase()?.endsWith('.zip')) return 'Archive';
    if (file?.name?.toLowerCase()?.endsWith('.geojson')) return 'Map';
    if (file?.name?.toLowerCase()?.endsWith('.kml')) return 'Map';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          dragActive
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,image/*,.zip,.geojson,.kml"
          onChange={(e) => handleFiles(e?.target?.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Documents
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Supported: PDF, JPG/PNG, ZIP (Shapefile), GeoJSON, KML</p>
              <p>• Maximum file size: 50MB</p>
              <p>• Multiple files allowed</p>
            </div>
          </div>
          
          <Button variant="outline" disabled={isUploading}>
            <Icon name="FolderOpen" size={16} className="mr-2" />
            Browse Files
          </Button>
        </div>
      </div>
      {/* Uploaded Files List */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Uploaded Documents</h4>
          <div className="space-y-3">
            {uploadedFiles?.map((file, index) => {
              const fileId = `${file?.name}-${Date.now()}-${index}`;
              const progress = uploadProgress?.[fileId] || 100;
              
              return (
                <div key={index} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={getFileIcon(file)} size={20} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{file?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file?.size)} • {file?.type || 'file'}
                        </p>
                        {file?.url && (
                          <a href={file?.url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                            View uploaded
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {progress < 100 ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 relative">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                className="text-muted"
                              />
                              <circle
                                cx="16"
                                cy="16"
                                r="14"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 14}`}
                                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                                className="text-primary transition-all duration-300"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium">{progress}%</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Icon name="CheckCircle" size={20} className="text-success" />
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                  {progress < 100 && (
                    <div className="mt-3">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadSection;
