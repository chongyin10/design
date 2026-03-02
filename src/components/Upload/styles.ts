import styled, { css } from 'styled-components';
import { UploadFile } from './types';

export const UploadWrapper = styled.div<{ disabled?: boolean }>`
    display: inline-block;
    ${props => props.disabled && css`
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    `}
`;

export const UploadInput = styled.input`
    display: none;
`;

export const UploadTrigger = styled.div`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

export const UploadDragArea = styled.div<{ isDragOver?: boolean; disabled?: boolean }>`
    border: 2px dashed var(--border-color, #d9d9d9);
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background-color: ${props => props.isDragOver ? 'var(--primary-light, #e6f7ff)' : 'transparent'};
    border-color: ${props => props.isDragOver ? 'var(--primary-color, #1890ff)' : 'var(--border-color, #d9d9d9)'};

    &:hover {
        border-color: var(--primary-color, #1890ff);
    }

    ${props => props.disabled && css`
        cursor: not-allowed;
        opacity: 0.6;
        &:hover {
            border-color: var(--border-color, #d9d9d9);
        }
    `}
`;

export const UploadDragIcon = styled.div`
    font-size: 48px;
    color: var(--text-secondary, #999);
    margin-bottom: 16px;
`;

export const UploadDragText = styled.div`
    font-size: 16px;
    color: var(--text-primary, #333);
    margin-bottom: 8px;
`;

export const UploadDragHint = styled.div`
    font-size: 14px;
    color: var(--text-secondary, #999);
`;

export const UploadListWrapper = styled.div`
    margin-top: 8px;
`;

export const UploadListItem = styled.div<{ status?: UploadFile['status'] }>`
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: var(--bg-light, #fafafa);
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
        background-color: var(--bg-hover, #f0f0f0);
    }

    ${props => props.status === 'error' && css`
        color: var(--error-color, #ff4d4f);
    `}

    ${props => props.status === 'success' && css`
        color: var(--success-color, #52c41a);
    `}
`;

export const UploadListItemInfo = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
`;

export const UploadListItemName = styled.span`
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
`;

export const UploadListItemIcon = styled.span`
    font-size: 14px;
`;

export const UploadListItemActions = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
`;

export const UploadListItemAction = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-secondary, #999);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.3s;

    &:hover {
        color: var(--text-primary, #333);
    }
`;

export const UploadProgress = styled.div`
    width: 100%;
    height: 4px;
    background-color: var(--border-color, #f0f0f0);
    border-radius: 2px;
    margin-top: 4px;
    overflow: hidden;
`;

export const UploadProgressBar = styled.div<{ percent: number; status?: UploadFile['status'] }>`
    height: 100%;
    background-color: ${props => {
        if (props.status === 'error') return 'var(--error-color, #ff4d4f)';
        if (props.status === 'success') return 'var(--success-color, #52c41a)';
        return 'var(--primary-color, #1890ff)';
    }};
    width: ${props => props.percent}%;
    transition: all 0.3s;
`;

export const UploadListItemContent = styled.div`
    flex: 1;
    overflow: hidden;
`;
