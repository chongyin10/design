import React, { useState } from 'react';
import { Flex, Upload, Button, Space, message, Table } from '../../components';
import { UploadFile } from '../../components/Upload';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// API 表格列定义
const columns = [
    { title: '属性', dataIndex: 'property', width: 150 },
    { title: '说明', dataIndex: 'description', width: 250 },
    { title: '类型', dataIndex: 'type', width: 250 },
    { title: '默认值', dataIndex: 'default', width: 120 },
];

// Upload Props API 表格数据
const uploadApiData = [
    { key: '1', property: 'action', description: '上传地址', type: 'string', default: '-' },
    { key: '2', property: 'defaultFileList', description: '默认已经上传的文件列表', type: 'UploadFile[]', default: '[]' },
    { key: '3', property: 'fileList', description: '已经上传的文件列表（受控）', type: 'UploadFile[]', default: '-' },
    { key: '4', property: 'onChange', description: '上传文件改变时的回调', type: '(fileList: UploadFile[]) => void', default: '-' },
    { key: '5', property: 'beforeUpload', description: '上传文件之前的钩子', type: '(file: File, fileList: File[]) => boolean | Promise<File>', default: '-' },
    { key: '6', property: 'onProgress', description: '文件上传时的回调', type: '(percent: number, file: UploadFile) => void', default: '-' },
    { key: '7', property: 'onSuccess', description: '文件上传成功时的回调', type: '(response: any, file: UploadFile) => void', default: '-' },
    { key: '8', property: 'onError', description: '文件上传失败时的回调', type: '(error: Error, file: UploadFile) => void', default: '-' },
    { key: '9', property: 'onRemove', description: '文件移除时的回调', type: '(file: UploadFile) => void | boolean | Promise<boolean>', default: '-' },
    { key: '10', property: 'headers', description: '设置上传的请求头部', type: 'Record<string, string>', default: '-' },
    { key: '11', property: 'name', description: '上传的文件字段名', type: 'string', default: "'file'" },
    { key: '12', property: 'data', description: '上传时附带的额外参数', type: 'Record<string, any> | ((file: File) => Record<string, any>)', default: '-' },
    { key: '13', property: 'withCredentials', description: '支持发送 cookie 凭证信息', type: 'boolean', default: 'false' },
    { key: '14', property: 'accept', description: '接受上传的文件类型', type: 'string', default: '-' },
    { key: '15', property: 'multiple', description: '是否支持多选文件', type: 'boolean', default: 'false' },
    { key: '16', property: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
    { key: '17', property: 'drag', description: '是否支持拖拽上传', type: 'boolean', default: 'false' },
    { key: '18', property: 'showUploadList', description: '是否显示文件列表', type: 'boolean', default: 'true' },
    { key: '19', property: 'maxCount', description: '最大上传文件数量', type: 'number', default: '-' },
    { key: '20', property: 'customRequest', description: '自定义上传方法', type: '(options: UploadRequestOptions) => void', default: '-' },
];

// UploadFile 类型数据
const uploadFileTypeData = [
    { key: '1', property: 'uid', description: '文件唯一标识', type: 'string', default: '-' },
    { key: '2', property: 'name', description: '文件名', type: 'string', default: '-' },
    { key: '3', property: 'size', description: '文件大小', type: 'number', default: '-' },
    { key: '4', property: 'type', description: '文件类型', type: 'string', default: '-' },
    { key: '5', property: 'status', description: '上传状态', type: "'ready' | 'uploading' | 'success' | 'error'", default: '-' },
    { key: '6', property: 'percent', description: '上传进度', type: 'number', default: '-' },
    { key: '7', property: 'response', description: '上传响应数据', type: 'any', default: '-' },
    { key: '8', property: 'error', description: '上传错误信息', type: 'Error', default: '-' },
    { key: '9', property: 'raw', description: '原始文件对象', type: 'File', default: '-' },
];

const UPLOAD_URL = 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload';

// 复制功能组件
const CopyBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    return (
        <div style={{ position: 'relative', marginBottom: '16px' }}>
            <button
                onClick={handleCopy}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 8px',
                    background: copied ? '#52c41a' : '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    zIndex: 1,
                }}
            >
                {copied ? '已复制' : '复制'}
            </button>
            <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ margin: 0 }}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div style={{ marginBottom: '32px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>{title}</h2>
        {children}
    </div>
);

const DemoRow: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Flex align="center" gap="middle" style={{ marginBottom: '16px' }}>
        <span style={{ minWidth: '120px', fontWeight: 500 }}>{title}:</span>
        {children}
    </Flex>
);

const UploadExample: React.FC = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange = (newFileList: UploadFile[]) => {
        setFileList(newFileList);
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('文件大小不能超过 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleSuccess = (response: any, file: UploadFile) => {
        message.success(`${file.name} 上传成功`);
        console.log('上传响应:', response);
    };

    const handleError = (error: Error, file: UploadFile) => {
        message.error(`${file.name} 上传失败: ${error.message}`);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Upload 文件上传</h1>
            <p>文件选择上传和拖拽上传控件。</p>

            {/* 基础用法 */}
            <Section title="基础用法">
                <DemoRow title="点击上传">
                    <Upload
                        action={UPLOAD_URL}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        showUploadList
                    >
                        <Button variant="primary">点击上传</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload, Button } from '@zjpcy/simple-design';

<Upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    onSuccess={(response, file) => {
        console.log('上传成功:', file.name);
    }}
    onError={(error, file) => {
        console.error('上传失败:', error);
    }}
>
    <Button variant="primary">点击上传</Button>
</Upload>`} />
            </Section>

            {/* 拖拽上传 */}
            <Section title="拖拽上传">
                <DemoRow title="拖拽区域">
                    <div style={{ width: '100%' }}>
                        <Upload
                            drag
                            action={UPLOAD_URL}
                            onSuccess={handleSuccess}
                            onError={handleError}
                            multiple
                        />
                    </div>
                </DemoRow>
                <CopyBlock code={`import { Upload } from '@zjpcy/simple-design';

<Upload
    drag
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    multiple
/>`} />
            </Section>

            {/* 受控模式 */}
            <Section title="受控模式">
                <DemoRow title="文件列表">
                    <Upload
                        fileList={fileList}
                        onChange={handleChange}
                        action={UPLOAD_URL}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        multiple
                    >
                        <Button variant="primary">选择文件</Button>
                    </Upload>
                </DemoRow>
                <DemoRow title="操作">
                    <Space>
                        <Button onClick={() => setFileList([])}>清空列表</Button>
                        <span>已选择 {fileList.length} 个文件</span>
                    </Space>
                </DemoRow>
                <CopyBlock code={`import { useState } from 'react';
import { Upload, Button } from '@zjpcy/simple-design';

const Demo = () => {
    const [fileList, setFileList] = useState([]);

    return (
        <>
            <Upload
                fileList={fileList}
                onChange={setFileList}
                action="https://..."
                multiple
            >
                <Button variant="primary">选择文件</Button>
            </Upload>
            <Button onClick={() => setFileList([])}>
                清空列表
            </Button>
        </>
    );
};`} />
            </Section>

            {/* 文件类型限制 */}
            <Section title="文件类型限制">
                <DemoRow title="限制图片">
                    <Upload
                        accept="image/*"
                        beforeUpload={beforeUpload}
                        action={UPLOAD_URL}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    >
                        <Button variant="primary">上传图片</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { message } from '@zjpcy/simple-design';

<Upload
    accept="image/*"
    beforeUpload={(file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传 JPG/PNG 文件!');
        }
        return isJpgOrPng;
    }}
    action="https://..."
>
    <Button variant="primary">上传图片</Button>
</Upload>`} />
            </Section>

            {/* 多文件上传 */}
            <Section title="多文件上传">
                <DemoRow title="多选">
                    <Upload
                        multiple
                        action={UPLOAD_URL}
                        onSuccess={handleSuccess}
                        onError={handleError}
                    >
                        <Button variant="primary">选择多个文件</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload, Button } from '@zjpcy/simple-design';

<Upload
    multiple
    action="https://..."
>
    <Button variant="primary">选择多个文件</Button>
</Upload>`} />
            </Section>

            {/* 上传进度 */}
            <Section title="上传进度">
                <p>使用自定义上传方法展示上传进度</p>
                <DemoRow title="进度条">
                    <Upload
                        multiple
                        customRequest={(options: any) => {
                            const { onProgress, onSuccess, onError, file } = options;
                            let percent = 0;
                            const interval = setInterval(() => {
                                percent += 10;
                                onProgress(percent);
                                if (percent >= 100) {
                                    clearInterval(interval);
                                    setTimeout(() => {
                                        onSuccess({ url: URL.createObjectURL(file) });
                                        message.success(`${file.name} 上传成功`);
                                    }, 200);
                                }
                            }, 200);
                            return {
                                abort: () => {
                                    clearInterval(interval);
                                    onError(new Error('上传已取消'));
                                }
                            };
                        }}
                    >
                        <Button variant="primary">模拟上传进度</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload, Button, message } from '@zjpcy/simple-design';

<Upload
    customRequest={(options) => {
        const { onProgress, onSuccess, onError, file } = options;
        let percent = 0;
        const interval = setInterval(() => {
            percent += 10;
            onProgress(percent);
            if (percent >= 100) {
                clearInterval(interval);
                onSuccess({ url: '...' });
            }
        }, 200);
        return {
            abort: () => clearInterval(interval)
        };
    }}
>
    <Button variant="primary">上传文件</Button>
</Upload>`} />
            </Section>

            {/* 禁用状态 */}
            <Section title="禁用状态">
                <DemoRow title="禁用">
                    <Upload disabled>
                        <Button variant="primary" disabled>点击上传</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload, Button } from '@zjpcy/simple-design';

<Upload disabled>
    <Button variant="primary" disabled>点击上传</Button>
</Upload>`} />
            </Section>

            {/* 最大文件数量 */}
            <Section title="最大文件数量">
                <DemoRow title="限制3个">
                    <Upload
                        maxCount={3}
                        action={UPLOAD_URL}
                        onSuccess={handleSuccess}
                        onError={handleError}
                        multiple
                    >
                        <Button variant="primary">最多上传3个文件</Button>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload, Button } from '@zjpcy/simple-design';

<Upload
    maxCount={3}
    action="https://..."
    multiple
>
    <Button variant="primary">最多上传3个文件</Button>
</Upload>`} />
            </Section>

            {/* 自定义触发器 */}
            <Section title="自定义触发器">
                <DemoRow title="自定义样式">
                    <Upload action={UPLOAD_URL} onSuccess={handleSuccess} onError={handleError}>
                        <div style={{
                            width: 100,
                            height: 100,
                            border: '1px dashed #d9d9d9',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.3s'
                        }}>
                            <span style={{ fontSize: 24, color: '#999' }}>+</span>
                        </div>
                    </Upload>
                </DemoRow>
                <CopyBlock code={`import { Upload } from '@zjpcy/simple-design';

<Upload action="https://...">
    <div style={{
        width: 100,
        height: 100,
        border: '1px dashed #d9d9d9',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    }}>
        <span style={{ fontSize: 24 }}>+</span>
    </div>
</Upload>`} />
            </Section>

            {/* API 文档 */}
            <Section title="API">
                <h3>Upload Props</h3>
                <Table
                    dataSource={uploadApiData}
                    columns={columns}
                    pagination={false}
                />

                <h3 style={{ marginTop: '30px' }}>UploadFile 类型</h3>
                <Table
                    dataSource={uploadFileTypeData}
                    columns={columns}
                    pagination={false}
                />
            </Section>
        </div>
    );
};

export default UploadExample;
