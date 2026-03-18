import React from 'react';

// ============================================
// 样式相关类型
// ============================================

/**
 * Upload 组件样式配置
 */
export interface UploadStyles {
  /** 上传容器自定义样式 */
  wrapper?: React.CSSProperties;
  /** 拖拽区域自定义样式 */
  dragArea?: React.CSSProperties;
  /** 拖拽图标自定义样式 */
  dragIcon?: React.CSSProperties;
  /** 拖拽文本自定义样式 */
  dragText?: React.CSSProperties;
  /** 拖拽提示自定义样式 */
  dragHint?: React.CSSProperties;
  /** 文件列表容器自定义样式 */
  list?: React.CSSProperties;
  /** 文件列表项自定义样式 */
  listItem?: React.CSSProperties;
  /** 文件信息区域自定义样式 */
  listItemInfo?: React.CSSProperties;
  /** 文件名自定义样式 */
  listItemName?: React.CSSProperties;
  /** 文件图标自定义样式 */
  listItemIcon?: React.CSSProperties;
  /** 文件操作区域自定义样式 */
  listItemActions?: React.CSSProperties;
  /** 文件操作按钮自定义样式 */
  listItemAction?: React.CSSProperties;
  /** 进度条容器自定义样式 */
  progress?: React.CSSProperties;
  /** 进度条自定义样式 */
  progressBar?: React.CSSProperties;
}

/**
 * 上传文件对象
 */
export interface UploadFile {
  /** 文件唯一标识 */
  uid: string;
  /** 文件名 */
  name: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件类型 */
  type: string;
  /** 上传状态 */
  status?: 'ready' | 'uploading' | 'success' | 'error';
  /** 上传进度（0-100） */
  percent?: number;
  /** 上传响应数据 */
  response?: any;
  /** 上传错误信息 */
  error?: Error;
  /** 原始文件对象 */
  raw?: File;
}

/**
 * 显示上传列表配置
 */
export interface ShowUploadListType {
  /** 是否显示删除图标 */
  showRemoveIcon?: boolean;
  /** 是否显示预览图标 */
  showPreviewIcon?: boolean;
  /** 是否显示下载图标 */
  showDownloadIcon?: boolean;
}

/**
 * 上传请求配置选项
 */
export interface UploadRequestOptions {
  /** 上传地址 */
  action: string;
  /** 文件字段名 */
  filename: string;
  /** 文件对象 */
  file: File;
  /** 额外数据 */
  data?: Record<string, any>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 是否携带 cookie */
  withCredentials?: boolean;
  /** 进度回调 */
  onProgress: (percent: number) => void;
  /** 成功回调 */
  onSuccess: (response: any) => void;
  /** 错误回调 */
  onError: (error: Error) => void;
  /** 请求方法 */
  method: string;
}

/**
 * 上传组件 Props
 */
export interface UploadProps {
  /** 上传地址 */
  action?: string;
  /** 默认已经上传的文件列表 */
  defaultFileList?: UploadFile[];
  /** 已经上传的文件列表（受控） */
  fileList?: UploadFile[];
  /** 上传文件改变时的回调 */
  onChange?: (fileList: UploadFile[]) => void;
  /** 上传文件之前的钩子，参数为上传的文件 */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<File>;
  /** 文件上传时的钩子 */
  onProgress?: (percent: number, file: UploadFile) => void;
  /** 文件上传成功时的钩子 */
  onSuccess?: (response: any, file: UploadFile) => void;
  /** 文件上传失败时的钩子 */
  onError?: (error: Error, file: UploadFile) => void;
  /** 文件移除时的钩子 */
  onRemove?: (file: UploadFile) => void | boolean | Promise<boolean>;
  /** 设置上传的请求头部 */
  headers?: Record<string, string>;
  /** 上传的文件字段名 */
  name?: string;
  /** 上传时附带的额外参数 */
  data?: Record<string, any> | ((file: File) => Record<string, any>);
  /** 支持发送 cookie 凭证信息 */
  withCredentials?: boolean;
  /** 接受上传的文件类型 */
  accept?: string;
  /** 是否支持多选文件 */
  multiple?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否支持拖拽上传 */
  drag?: boolean;
  /** 上传组件的样式 */
  style?: React.CSSProperties;
  /** 上传组件的类名 */
  className?: string;
  /** 自定义上传方法 */
  customRequest?: (options: UploadRequestOptions) => { abort: () => void } | void;
  /** 文件列表渲染 */
  itemRender?: (file: UploadFile, fileList: UploadFile[]) => React.ReactNode;
  /** 是否显示文件列表 */
  showUploadList?: boolean | ShowUploadListType;
  /** 自定义请求方法 */
  method?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch';
  /** 子元素 */
  children?: React.ReactNode;
  /** 最大上传文件数量 */
  maxCount?: number;
  /** 自定义样式 */
  customStyles?: UploadStyles;
  // ============================================
  // 分片上传配置
  // ============================================
  /** 是否启用分片上传 */
  chunked?: boolean;
  /** 分片上传配置 */
  chunkOptions?: ChunkOptions;
  /** 合并分片接口地址（分片上传时使用） */
  mergeAction?: string;
  /** 自定义分片上传方法 */
  customChunkRequest?: (options: ChunkUploadRequestOptions) => { abort: () => void } | void;
  /** 自定义合并分片方法 */
  customMergeRequest?: (options: MergeChunksRequestOptions) => { abort: () => void } | void;
  /** 分片上传进度回调 */
  onChunkProgress?: (chunkIndex: number, percent: number, file: UploadFile) => void;
  /** 分片上传成功回调 */
  onChunkSuccess?: (chunkIndex: number, response: any, file: UploadFile) => void;
  /** 分片上传失败回调 */
  onChunkError?: (chunkIndex: number, error: Error, file: UploadFile) => void;
}

/**
 * 上传列表组件 Props
 */
export interface UploadListProps {
  /** 文件列表 */
  fileList: UploadFile[];
  /** 移除文件回调 */
  onRemove: (file: UploadFile) => void;
  /** 是否显示文件列表 */
  showUploadList?: boolean | ShowUploadListType;
  /** 自定义渲染文件列表 */
  itemRender?: (file: UploadFile, fileList: UploadFile[]) => React.ReactNode;
}

/**
 * 拖拽上传组件 Props
 */
export interface UploadDragProps extends Omit<UploadProps, 'drag'> {
  /** 子元素 */
  children?: React.ReactNode;
}

// ============================================
// 分片上传相关类型
// ============================================

/**
 * 分片字段名配置
 */
export interface ChunkFieldNames {
  /** 分片索引字段名，默认 'chunkIndex' */
  chunkIndex?: string;
  /** 总分片数字段名，默认 'totalChunks' */
  totalChunks?: string;
  /** 文件唯一标识字段名，默认 'fileId' */
  fileId?: string;
  /** 文件名字段名，默认 'fileName' */
  fileName?: string;
  /** 文件大小字段名，默认 'fileSize' */
  fileSize?: string;
  /** 其他自定义字段 */
  [x: string]: string | undefined;
}

/**
 * 合并分片字段名配置
 */
export interface MergeFieldNames {
  /** 文件唯一标识字段名，默认 'fileId' */
  fileId?: string;
  /** 文件名字段名，默认 'filename' */
  filename?: string;
  /** 总分片数字段名，默认 'totalChunks' */
  totalChunks?: string;
  /** 文件总大小字段名，默认 'totalSize' */
  totalSize?: string;
  /** 其他自定义字段 */
  [x: string]: string | undefined;
}

/**
 * 分片配置选项
 */
export interface ChunkOptions {
  /** 每个分片的大小（字节），默认 2MB */
  chunkSize?: number;
  /** 同时上传的分片数量，默认 3 */
  concurrency?: number;
  /** 是否支持断点续传 */
  resumable?: boolean;
  /** 重试次数 */
  retryCount?: number;
  /** 重试延迟（毫秒） */
  retryDelay?: number;
  /** 分片字段名配置 */
  fieldNames?: ChunkFieldNames;
  /** 合并分片字段名配置 */
  mergeFieldNames?: MergeFieldNames;
}

/**
 * 分片信息
 */
export interface ChunkInfo {
  /** 分片索引 */
  index: number;
  /** 分片起始字节位置 */
  start: number;
  /** 分片结束字节位置 */
  end: number;
  /** 分片大小 */
  size: number;
  /** 分片数据 */
  blob: Blob;
  /** 分片状态 */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** 重试次数 */
  retryCount: number;
}

/**
 * 分片上传状态
 */
export interface ChunkUploadState {
  /** 文件唯一标识 */
  fileId: string;
  /** 总分片数 */
  totalChunks: number;
  /** 已上传分片数 */
  uploadedChunks: number;
  /** 已上传分片索引集合 */
  uploadedChunkIndices: Set<number>;
  /** 分片列表 */
  chunks: ChunkInfo[];
  /** 整体进度（0-100） */
  percent: number;
}

/**
 * 分片上传请求参数
 */
export interface ChunkUploadRequestOptions {
  /** 上传地址 */
  action: string;
  /** 文件字段名 */
  filename: string;
  /** 文件对象 */
  file: File;
  /** 文件唯一标识 */
  fileId: string;
  /** 当前分片 */
  chunk: ChunkInfo;
  /** 总分片数 */
  totalChunks: number;
  /** 额外数据 */
  data?: Record<string, any>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 是否携带 cookie */
  withCredentials?: boolean;
  /** 请求方法 */
  method: string;
  /** 进度回调 */
  onProgress: (percent: number) => void;
  /** 成功回调 */
  onSuccess: (response: any) => void;
  /** 错误回调 */
  onError: (error: Error) => void;
}

/**
 * 合并分片请求参数
 */
export interface MergeChunksRequestOptions {
  /** 合并接口地址 */
  action: string;
  /** 文件唯一标识 */
  fileId: string;
  /** 文件名 */
  filename: string;
  /** 总分片数 */
  totalChunks: number;
  /** 文件总大小 */
  totalSize: number;
  /** 额外数据 */
  data?: Record<string, any>;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 是否携带 cookie */
  withCredentials?: boolean;
  /** 成功回调 */
  onSuccess: (response: any) => void;
  /** 错误回调 */
  onError: (error: Error) => void;
}

/**
 * 分片上传 hooks 返回类型
 */
export interface UseChunkUploadReturn {
  /** 开始分片上传 */
  upload: (file: File) => Promise<void>;
  /** 暂停上传 */
  pause: () => void;
  /** 恢复上传 */
  resume: () => void;
  /** 取消上传 */
  abort: () => void;
  /** 当前上传状态 */
  state: ChunkUploadState | null;
  /** 是否正在上传 */
  isUploading: boolean;
  /** 是否已暂停 */
  isPaused: boolean;
}
