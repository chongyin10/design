import React from 'react';

export interface UploadFile {
    uid: string;
    name: string;
    size: number;
    type: string;
    status?: 'ready' | 'uploading' | 'success' | 'error';
    percent?: number;
    response?: any;
    error?: Error;
    raw?: File;
}

export interface UploadProps {
    /** 上传地址 */
    action?: string;
    /** 默认已经上传的文件列表 */
    defaultFileList?: UploadFile[];
    /** 已经上传的文件列表（受控） */
    fileList?: UploadFile[];
    /** 上传文件改变时的状态 */
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
    customRequest?: (options: UploadRequestOptions) => void;
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
}

export interface ShowUploadListType {
    showRemoveIcon?: boolean;
    showPreviewIcon?: boolean;
    showDownloadIcon?: boolean;
}

export interface UploadRequestOptions {
    action: string;
    filename: string;
    file: File;
    data?: Record<string, any>;
    headers?: Record<string, string>;
    withCredentials?: boolean;
    onProgress: (percent: number) => void;
    onSuccess: (response: any) => void;
    onError: (error: Error) => void;
    method: string;
}

export interface UploadListProps {
    fileList: UploadFile[];
    onRemove: (file: UploadFile) => void;
    showUploadList?: boolean | ShowUploadListType;
    itemRender?: (file: UploadFile, fileList: UploadFile[]) => React.ReactNode;
}

export interface UploadDragProps extends Omit<UploadProps, 'drag'> {
    children?: React.ReactNode;
}
