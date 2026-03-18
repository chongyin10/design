'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import {
    ChunkOptions,
    ChunkFieldNames,
    MergeFieldNames,
    ChunkInfo,
    ChunkUploadState,
    ChunkUploadRequestOptions,
    MergeChunksRequestOptions,
    UseChunkUploadReturn,
    UploadFile
} from './types';

// 默认分片字段名配置
const DEFAULT_CHUNK_FIELD_NAMES: Required<ChunkFieldNames> = {
    chunkIndex: 'chunkIndex',
    totalChunks: 'totalChunks',
    fileId: 'fileId',
    fileName: 'fileName',
    fileSize: 'fileSize'
};

// 默认合并分片字段名配置
const DEFAULT_MERGE_FIELD_NAMES: Required<MergeFieldNames> = {
    fileId: 'fileId',
    filename: 'filename',
    totalChunks: 'totalChunks',
    totalSize: 'totalSize'
};

// 默认分片配置
const DEFAULT_CHUNK_OPTIONS: Required<ChunkOptions> = {
    chunkSize: 2 * 1024 * 1024, // 2MB
    concurrency: 3,
    resumable: true,
    retryCount: 3,
    retryDelay: 1000,
    fieldNames: DEFAULT_CHUNK_FIELD_NAMES,
    mergeFieldNames: DEFAULT_MERGE_FIELD_NAMES
};

/**
 * 生成文件唯一标识（使用文件名+大小+修改时间）
 */
const generateFileId = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}-${Date.now()}`;
};

/**
 * 创建分片
 */
const createChunks = (file: File, chunkSize: number): ChunkInfo[] => {
    const chunks: ChunkInfo[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        chunks.push({
            index: i,
            start,
            end,
            size: end - start,
            blob: file.slice(start, end),
            status: 'pending',
            retryCount: 0
        });
    }

    return chunks;
};

/**
 * 默认分片上传请求
 */
const defaultChunkRequest = (options: ChunkUploadRequestOptions & { fieldNames?: ChunkFieldNames }): { abort: () => void } => {
    const {
        action,
        filename,
        file,
        fileId,
        chunk,
        totalChunks,
        data,
        headers,
        withCredentials,
        method,
        fieldNames,
        onProgress,
        onSuccess,
        onError
    } = options;

    // 合并字段名配置
    const mergedFieldNames = { ...DEFAULT_CHUNK_FIELD_NAMES, ...fieldNames };

    const xhr = new XMLHttpRequest();

    // 进度监听
    if (xhr.upload) {
        xhr.upload.onprogress = (e) => {
            if (e.total > 0) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };
    }

    xhr.onerror = () => {
        onError(new Error(`Chunk ${chunk.index} upload failed`));
    };

    xhr.ontimeout = () => {
        onError(new Error(`Chunk ${chunk.index} upload timeout`));
    };

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.response);
                onSuccess(response);
            } catch {
                onSuccess(xhr.response);
            }
        } else {
            onError(new Error(`Chunk ${chunk.index} upload failed with status ${xhr.status}`));
        }
    };

    xhr.open(method, action, true);

    if (withCredentials) {
        xhr.withCredentials = true;
    }

    // 设置请求头
    if (headers) {
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    // 创建 FormData
    const formData = new FormData();
    formData.append(filename, chunk.blob, file.name);
    formData.append(mergedFieldNames.chunkIndex, String(chunk.index));
    formData.append(mergedFieldNames.totalChunks, String(totalChunks));
    formData.append(mergedFieldNames.fileId, fileId);
    formData.append(mergedFieldNames.fileName, file.name);
    formData.append(mergedFieldNames.fileSize, String(file.size));

    // 添加额外数据
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

/**
 * 默认合并分片请求
 */
const defaultMergeRequest = (options: MergeChunksRequestOptions & { fieldNames?: MergeFieldNames }): { abort: () => void } => {
    const {
        action,
        fileId,
        filename,
        totalChunks,
        totalSize,
        data,
        headers,
        withCredentials,
        fieldNames,
        onSuccess,
        onError
    } = options;

    // 合并字段名配置
    const mergedFieldNames = { ...DEFAULT_MERGE_FIELD_NAMES, ...fieldNames };

    const xhr = new XMLHttpRequest();

    xhr.onerror = () => {
        onError(new Error('Merge chunks failed'));
    };

    xhr.ontimeout = () => {
        onError(new Error('Merge chunks timeout'));
    };

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            try {
                const response = JSON.parse(xhr.response);
                onSuccess(response);
            } catch {
                onSuccess(xhr.response);
            }
        } else {
            onError(new Error(`Merge chunks failed with status ${xhr.status}`));
        }
    };

    xhr.open('POST', action, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    if (withCredentials) {
        xhr.withCredentials = true;
    }

    if (headers) {
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
    }

    const body = JSON.stringify({
        [mergedFieldNames.fileId]: fileId,
        [mergedFieldNames.filename]: filename,
        [mergedFieldNames.totalChunks]: totalChunks,
        [mergedFieldNames.totalSize]: totalSize,
        ...data
    });

    xhr.send(body);

    return {
        abort: () => {
            xhr.abort();
        }
    };
};

/**
 * 分片上传 Hook
 */
export const useChunkUpload = (
    options: {
        action?: string;
        mergeAction?: string;
        filename?: string;
        data?: Record<string, any> | ((file: File) => Record<string, any>);
        headers?: Record<string, string>;
        withCredentials?: boolean;
        method?: string;
        chunkOptions?: ChunkOptions;
        customChunkRequest?: (options: ChunkUploadRequestOptions) => { abort: () => void } | void;
        customMergeRequest?: (options: MergeChunksRequestOptions) => { abort: () => void } | void;
        onProgress?: (percent: number, file: UploadFile) => void;
        onSuccess?: (response: any, file: UploadFile) => void;
        onError?: (error: Error, file: UploadFile) => void;
        onChunkProgress?: (chunkIndex: number, percent: number, file: UploadFile) => void;
        onChunkSuccess?: (chunkIndex: number, response: any, file: UploadFile) => void;
        onChunkError?: (chunkIndex: number, error: Error, file: UploadFile) => void;
    }
): UseChunkUploadReturn => {
    const {
        action = '',
        mergeAction,
        filename = 'file',
        data,
        headers,
        withCredentials = false,
        method = 'POST',
        chunkOptions = {},
        customChunkRequest,
        customMergeRequest,
        onProgress: _onProgress,
        onSuccess,
        onError,
        onChunkProgress,
        onChunkSuccess,
        onChunkError
    } = options;

    // 使用 _onProgress 避免未使用变量警告，同时保留扩展性
    void _onProgress;

    // 合并配置
    const mergedOptions = useMemo(() => ({
        ...DEFAULT_CHUNK_OPTIONS,
        ...chunkOptions
    }), [chunkOptions]);

    // 状态
    const [state, setState] = useState<ChunkUploadState | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Refs
    const currentFileRef = useRef<File | null>(null);
    const currentUploadFileRef = useRef<UploadFile | null>(null);
    const abortControllersRef = useRef<Map<number, { abort: () => void }>>(new Map());
    const pausedRef = useRef(false);
    const uploadingChunksRef = useRef<Set<number>>(new Set());

    // 更新暂停状态 ref
    pausedRef.current = isPaused;

    /**
     * 更新分片状态
     */
    const updateChunkStatus = useCallback((chunkIndex: number, status: ChunkInfo['status']) => {
        setState(prev => {
            if (!prev) return prev;
            const newChunks = [...prev.chunks];
            newChunks[chunkIndex] = { ...newChunks[chunkIndex], status };
            return { ...prev, chunks: newChunks };
        });
    }, []);

    /**
     * 上传单个分片
     */
    const uploadChunk = useCallback(async (chunk: ChunkInfo, file: File, fileId: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (pausedRef.current) {
                reject(new Error('Upload paused'));
                return;
            }

            updateChunkStatus(chunk.index, 'uploading');
            uploadingChunksRef.current.add(chunk.index);

            const uploadData = typeof data === 'function' ? data(file) : data;

            const requestOptions: ChunkUploadRequestOptions & { fieldNames?: ChunkFieldNames } = {
                action,
                filename,
                file,
                fileId,
                chunk,
                totalChunks: state?.totalChunks || Math.ceil(file.size / mergedOptions.chunkSize),
                data: uploadData,
                headers,
                withCredentials,
                method: method.toUpperCase(),
                fieldNames: mergedOptions.fieldNames,
                onProgress: (percent) => {
                    if (currentUploadFileRef.current) {
                        onChunkProgress?.(chunk.index, percent, currentUploadFileRef.current);
                    }
                },
                onSuccess: (response) => {
                    updateChunkStatus(chunk.index, 'success');
                    uploadingChunksRef.current.delete(chunk.index);
                    if (currentUploadFileRef.current) {
                        onChunkSuccess?.(chunk.index, response, currentUploadFileRef.current);
                    }
                    resolve();
                },
                onError: (error) => {
                    updateChunkStatus(chunk.index, 'error');
                    uploadingChunksRef.current.delete(chunk.index);
                    if (currentUploadFileRef.current) {
                        onChunkError?.(chunk.index, error, currentUploadFileRef.current);
                    }
                    reject(error);
                }
            };

            const controller = customChunkRequest
                ? customChunkRequest(requestOptions) || { abort: () => {} }
                : defaultChunkRequest(requestOptions);

            abortControllersRef.current.set(chunk.index, controller);
        });
    }, [action, filename, data, headers, withCredentials, method, state, mergedOptions, customChunkRequest, updateChunkStatus, onChunkProgress, onChunkSuccess, onChunkError]);

    /**
     * 执行分片上传（带并发控制和重试）
     */
    const executeChunkUpload = useCallback(async (file: File, fileId: string, chunks: ChunkInfo[]) => {
        const pendingChunks = chunks.filter(c => c.status === 'pending');
        const { concurrency, retryCount, retryDelay } = mergedOptions;

        // 更新状态
        setState(prev => prev ? {
            ...prev,
            uploadedChunks: chunks.length - pendingChunks.length,
            uploadedChunkIndices: new Set(chunks.filter(c => c.status === 'success').map(c => c.index))
        } : null);

        // 并发控制
        const queue = [...pendingChunks];
        const executing: Promise<void>[] = [];

        const processChunk = async (chunk: ChunkInfo): Promise<void> => {
            let lastError: Error | null = null;

            for (let attempt = 0; attempt <= retryCount; attempt++) {
                if (pausedRef.current) {
                    throw new Error('Upload paused');
                }

                try {
                    await uploadChunk(chunk, file, fileId);

                    // 更新进度
                    setState(prev => {
                        if (!prev) return prev;
                        const uploadedCount = prev.chunks.filter(c => c.status === 'success').length;
                        const percent = Math.round((uploadedCount / prev.totalChunks) * 100);
                        return {
                            ...prev,
                            uploadedChunks: uploadedCount,
                            percent
                        };
                    });

                    return;
                } catch (error) {
                    lastError = error as Error;
                    if (error instanceof Error && error.message === 'Upload paused') {
                        throw error;
                    }
                    if (attempt < retryCount) {
                        await new Promise(r => setTimeout(r, retryDelay));
                    }
                }
            }

            throw lastError || new Error(`Chunk ${chunk.index} failed after ${retryCount} retries`);
        };

        while (queue.length > 0 || executing.length > 0) {
            if (pausedRef.current) {
                throw new Error('Upload paused');
            }

            // 启动新的上传任务
            while (executing.length < concurrency && queue.length > 0) {
                const chunk = queue.shift()!;
                executing.push(processChunk(chunk));
            }

            // 等待至少一个任务完成
            if (executing.length > 0) {
                await Promise.race(executing);
            }
        }

        await Promise.all(executing);
    }, [mergedOptions, uploadChunk]);

    /**
     * 合并分片
     */
    const mergeChunks = useCallback(async (file: File, fileId: string, totalChunks: number): Promise<any> => {
        return new Promise((resolve, reject) => {
            const mergeData = typeof data === 'function' ? data(file) : data;

            const options: MergeChunksRequestOptions & { fieldNames?: MergeFieldNames } = {
                action: mergeAction || action,
                fileId,
                filename: file.name,
                totalChunks,
                totalSize: file.size,
                data: mergeData,
                headers,
                withCredentials,
                fieldNames: mergedOptions.mergeFieldNames,
                onSuccess: resolve,
                onError: reject
            };

            const controller = customMergeRequest
                ? customMergeRequest(options) || { abort: () => {} }
                : defaultMergeRequest(options);

            abortControllersRef.current.set(-1, controller);
        });
    }, [action, mergeAction, data, headers, withCredentials, mergedOptions.mergeFieldNames, customMergeRequest]);

    /**
     * 开始上传
     */
    const upload = useCallback(async (file: File) => {
        if (!action) {
            throw new Error('Upload: action is required for chunked upload');
        }

        currentFileRef.current = file;

        const fileId = generateFileId(file);
        const chunks = createChunks(file, mergedOptions.chunkSize);

        const initialState: ChunkUploadState = {
            fileId,
            totalChunks: chunks.length,
            uploadedChunks: 0,
            uploadedChunkIndices: new Set(),
            chunks,
            percent: 0
        };

        setState(initialState);
        setIsUploading(true);
        setIsPaused(false);

        const uploadFile: UploadFile = {
            uid: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploading',
            percent: 0,
            raw: file
        };
        currentUploadFileRef.current = uploadFile;

        try {
            // 执行分片上传
            await executeChunkUpload(file, fileId, chunks);

            // 合并分片
            const response = await mergeChunks(file, fileId, chunks.length);

            setState(prev => prev ? { ...prev, percent: 100 } : null);
            setIsUploading(false);

            if (currentUploadFileRef.current) {
                currentUploadFileRef.current.status = 'success';
                currentUploadFileRef.current.percent = 100;
                onSuccess?.(response, currentUploadFileRef.current);
            }

            return response;
        } catch (error) {
            setIsUploading(false);

            if (error instanceof Error && error.message === 'Upload paused') {
                return;
            }

            if (currentUploadFileRef.current) {
                currentUploadFileRef.current.status = 'error';
                currentUploadFileRef.current.error = error as Error;
                onError?.(error as Error, currentUploadFileRef.current);
            }

            throw error;
        }
    }, [action, mergedOptions, executeChunkUpload, mergeChunks, onSuccess, onError]);

    /**
     * 暂停上传
     */
    const pause = useCallback(() => {
        setIsPaused(true);
        pausedRef.current = true;

        // 中止所有正在上传的分片
        abortControllersRef.current.forEach((controller, index) => {
            if (index !== -1 && uploadingChunksRef.current.has(index)) {
                controller.abort();
            }
        });
    }, []);

    /**
     * 恢复上传
     */
    const resume = useCallback(async () => {
        if (!state || !currentFileRef.current || !pausedRef.current) return;

        setIsPaused(false);
        pausedRef.current = false;
        setIsUploading(true);

        try {
            await executeChunkUpload(currentFileRef.current, state.fileId, state.chunks);

            // 检查是否全部上传完成
            const allSuccess = state.chunks.every(c => c.status === 'success');
            if (allSuccess) {
                const response = await mergeChunks(
                    currentFileRef.current,
                    state.fileId,
                    state.totalChunks
                );

                setState(prev => prev ? { ...prev, percent: 100 } : null);
                setIsUploading(false);

                if (currentUploadFileRef.current) {
                    currentUploadFileRef.current.status = 'success';
                    currentUploadFileRef.current.percent = 100;
                    onSuccess?.(response, currentUploadFileRef.current);
                }
            }
        } catch (error) {
            setIsUploading(false);
            if (error instanceof Error && error.message !== 'Upload paused') {
                if (currentUploadFileRef.current) {
                    currentUploadFileRef.current.status = 'error';
                    currentUploadFileRef.current.error = error as Error;
                    onError?.(error as Error, currentUploadFileRef.current);
                }
            }
        }
    }, [state, executeChunkUpload, mergeChunks, onSuccess, onError]);

    /**
     * 取消上传
     */
    const abort = useCallback(() => {
        // 中止所有请求
        abortControllersRef.current.forEach(controller => {
            controller.abort();
        });
        abortControllersRef.current.clear();
        uploadingChunksRef.current.clear();

        setIsUploading(false);
        setIsPaused(false);
        pausedRef.current = false;
        setState(null);
        currentFileRef.current = null;
        currentUploadFileRef.current = null;
    }, []);

    return {
        upload,
        pause,
        resume,
        abort,
        state,
        isUploading,
        isPaused
    };
};

export default useChunkUpload;
