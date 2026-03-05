import React, { useState, useRef, useCallback } from 'react';
import classNames from 'classnames';
import { UploadProps, UploadFile, UploadRequestOptions, ShowUploadListType } from './types';
import Icon from '../Icon';
import Progress from '../Progress';
import './Upload.css';

// 生成唯一 ID
const generateUid = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 默认上传请求
const defaultRequest = (options: UploadRequestOptions) => {
    const { action, filename, file, data, headers, withCredentials, onProgress, onSuccess, onError, method } = options;

    const xhr = new XMLHttpRequest();
    
    if (onProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
            if (e.total > 0) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };
    }

    xhr.onerror = () => {
        onError(new Error('Upload failed'));
    };

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            onSuccess(xhr.response);
        } else {
            onError(new Error(`Upload failed with status ${xhr.status}`));
        }
    };

    xhr.open(method, action, true);

    if (withCredentials) {
        xhr.withCredentials = true;
    }

    if (headers) {
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    const formData = new FormData();
    formData.append(filename, file);

    if (data) {
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
    }

    xhr.send(formData);

    return {
        abort: () => {
            xhr.abort();
        }
    };
};

// 上传列表项组件
const UploadList: React.FC<{
    fileList: UploadFile[];
    onRemove: (file: UploadFile) => void;
    showUploadList?: boolean | ShowUploadListType;
}> = ({ fileList, onRemove, showUploadList }) => {
    if (!showUploadList || fileList.length === 0) return null;

    const showRemoveIcon = typeof showUploadList === 'boolean' ? showUploadList : showUploadList.showRemoveIcon !== false;

    const getStatusIcon = (status?: UploadFile['status']) => {
        switch (status) {
            case 'uploading':
                return <Icon type="loading" spin />;
            case 'success':
                return <Icon type="check-circle" style={{ color: 'var(--success-color, #52c41a)' }} />;
            case 'error':
                return <Icon type="close-circle" style={{ color: 'var(--error-color, #ff4d4f)' }} />;
            default:
                return <Icon type="file" />;
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="zjpcy-upload__list">
            {fileList.map((file) => (
                <div
                    key={file.uid}
                    className={classNames('zjpcy-upload__list-item', {
                        'zjpcy-upload__list-item-error': file.status === 'error',
                        'zjpcy-upload__list-item-success': file.status === 'success'
                    })}
                >
                    <div className="zjpcy-upload__list-item-info">
                        <span className="zjpcy-upload__list-item-icon">
                            {getStatusIcon(file.status)}
                        </span>
                        <span className="zjpcy-upload__list-item-name" title={file.name}>
                            {file.name}
                            <span style={{ color: 'var(--text-secondary, #999)', marginLeft: 8, fontSize: 12 }}>
                                ({formatSize(file.size)})
                            </span>
                        </span>
                    </div>
                    {showRemoveIcon && (
                        <span className="zjpcy-upload__list-item-actions">
                            <button
                                className="zjpcy-upload__list-item-action"
                                onClick={() => onRemove(file)}
                                title="删除"
                            >
                                <Icon type="trash" />
                            </button>
                        </span>
                    )}
                    <div className={classNames('zjpcy-upload__progress-wrapper', {
                        'zjpcy-upload__progress-wrapper-visible': file.status === 'uploading'
                    })}>
                        <Progress
                            percent={file.percent || 0}
                            size="small"
                            showInfo={false}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// 拖拽上传区域组件
const UploadDrag: React.FC<{
    disabled?: boolean;
    onFileDrop: (files: FileList) => void;
    children?: React.ReactNode;
    accept?: string;
    multiple?: boolean;
}> = ({ disabled, onFileDrop, children, accept, multiple }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const dragRef = useRef<HTMLDivElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFileDrop(files);
        }
    }, [disabled, onFileDrop]);

    const handleClick = useCallback(() => {
        if (dragRef.current && !disabled) {
            const input = document.createElement('input');
            input.type = 'file';
            if (accept) input.accept = accept;
            if (multiple) input.multiple = true;
            input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                    onFileDrop(files);
                }
            };
            input.click();
        }
    }, [accept, multiple, disabled, onFileDrop]);

    return (
        <div
            ref={dragRef}
            className={classNames('zjpcy-upload__drag', {
                'zjpcy-upload__drag-over': isDragOver,
                'zjpcy-upload__drag-disabled': disabled
            })}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            {children || (
                <>
                    <div className="zjpcy-upload__drag-icon">
                        <Icon type="upload" style={{ fontSize: 48 }} />
                    </div>
                    <div className="zjpcy-upload__drag-text">
                        点击或拖拽文件到此区域上传
                    </div>
                    <div className="zjpcy-upload__drag-hint">
                        支持单次或批量上传
                    </div>
                </>
            )}
        </div>
    );
};

// 主上传组件
const Upload: React.FC<UploadProps> = ({
    action,
    defaultFileList = [],
    fileList: controlledFileList,
    onChange,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onRemove,
    headers,
    name = 'file',
    data,
    withCredentials = false,
    accept,
    multiple = false,
    disabled = false,
    drag = false,
    style,
    className,
    customRequest,
    itemRender: _itemRender,
    showUploadList = true,
    method = 'POST',
    children,
    maxCount
}) => {
    const [internalFileList, setInternalFileList] = useState<UploadFile[]>(defaultFileList);
    const inputRef = useRef<HTMLInputElement>(null);

    const isControlled = controlledFileList !== undefined;
    const fileList = isControlled ? controlledFileList : internalFileList;

    const updateFileList = useCallback((newFileList: UploadFile[]) => {
        if (!isControlled) {
            setInternalFileList(newFileList);
        }
        if (onChange) {
            onChange(newFileList);
        }
    }, [isControlled, onChange]);

    const updateFileStatus = useCallback((uid: string, updates: Partial<UploadFile>) => {
        const newFileList = fileList.map(file =>
            file.uid === uid ? { ...file, ...updates } : file
        );
        updateFileList(newFileList);
    }, [fileList, updateFileList]);

    const uploadFile = useCallback(async (file: UploadFile) => {
        if (!action && !customRequest) {
            console.warn('Upload: action or customRequest is required');
            return;
        }

        const rawFile = file.raw;
        if (!rawFile) return;

        updateFileStatus(file.uid, { status: 'uploading', percent: 0 });

        const uploadData = typeof data === 'function' ? data(rawFile) : data;

        const options: UploadRequestOptions = {
            action: action || '',
            filename: name,
            file: rawFile,
            data: uploadData,
            headers,
            withCredentials,
            method: method.toUpperCase(),
            onProgress: (percent) => {
                updateFileStatus(file.uid, { percent });
                if (onProgress) {
                    onProgress(percent, file);
                }
            },
            onSuccess: (response) => {
                updateFileStatus(file.uid, { status: 'success', response, percent: 100 });
                if (onSuccess) {
                    onSuccess(response, file);
                }
            },
            onError: (error) => {
                updateFileStatus(file.uid, { status: 'error', error });
                if (onError) {
                    onError(error, file);
                }
            }
        };

        if (customRequest) {
            customRequest(options);
        } else {
            defaultRequest(options);
        }
    }, [action, customRequest, name, data, headers, withCredentials, method, onProgress, onSuccess, onError, updateFileStatus]);

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        
        // 检查最大上传数量
        if (maxCount !== undefined && fileList.length + fileArray.length > maxCount) {
            console.warn(`Upload: Maximum file count is ${maxCount}`);
            return;
        }

        for (const rawFile of fileArray) {
            const newFile: UploadFile = {
                uid: generateUid(),
                name: rawFile.name,
                size: rawFile.size,
                type: rawFile.type,
                status: 'ready',
                percent: 0,
                raw: rawFile
            };

            // 执行 beforeUpload 检查
            if (beforeUpload) {
                try {
                    const result = await beforeUpload(rawFile, fileArray);
                    if (result === false) {
                        continue;
                    }
                    if (result instanceof File) {
                        newFile.raw = result;
                        newFile.name = result.name;
                        newFile.size = result.size;
                        newFile.type = result.type;
                    }
                } catch (error) {
                    continue;
                }
            }

            // 如果会自动上传，直接设置为 uploading 状态
            if (action || customRequest) {
                newFile.status = 'uploading';
            }

            const newFileList = [...fileList, newFile];
            updateFileList(newFileList);

            // 自动上传
            if (action || customRequest) {
                // 使用 setTimeout 确保状态更新后再开始上传
                setTimeout(() => uploadFile(newFile), 0);
            }
        }
    }, [fileList, maxCount, beforeUpload, action, customRequest, uploadFile, updateFileList]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // 清空 input 值，允许重复选择相同文件
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [handleFiles]);

    const handleClick = useCallback(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.click();
        }
    }, [disabled]);

    const handleRemove = useCallback(async (file: UploadFile) => {
        if (onRemove) {
            const result = await onRemove(file);
            if (result === false) {
                return;
            }
        }
        const newFileList = fileList.filter(f => f.uid !== file.uid);
        updateFileList(newFileList);
    }, [fileList, onRemove, updateFileList]);

    const handleFileDrop = useCallback((files: FileList) => {
        handleFiles(files);
    }, [handleFiles]);

    return (
        <div
            className={classNames('zjpcy-upload', className, {
                'zjpcy-upload--disabled': disabled
            })}
            style={style}
        >
            <input
                ref={inputRef}
                type="file"
                className="zjpcy-upload__input"
                accept={accept}
                multiple={multiple}
                onChange={handleInputChange}
            />
            
            {drag ? (
                <UploadDrag
                    disabled={disabled}
                    onFileDrop={handleFileDrop}
                    accept={accept}
                    multiple={multiple}
                >
                    {children}
                </UploadDrag>
            ) : (
                <div className="zjpcy-upload__trigger" onClick={handleClick}>
                    {children || (
                        <button className="zjpcy-btn zjpcy-btn--primary" disabled={disabled}>
                            <Icon type="upload" style={{ marginRight: 4 }} />
                            点击上传
                        </button>
                    )}
                </div>
            )}

            {showUploadList && (
                <UploadList
                    fileList={fileList}
                    onRemove={handleRemove}
                    showUploadList={showUploadList}
                />
            )}
        </div>
    );
};

export default Upload;
export type { UploadFile, UploadProps, UploadRequestOptions };
