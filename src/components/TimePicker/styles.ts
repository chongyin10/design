import styled from 'styled-components';

export const TimePickerContainer = styled.div<{ width?: string | number }>`
    display: inline-block;
    position: relative;
    font-size: 14px;
    font-family: inherit;
    width: ${props => typeof props.width === 'number' ? `${props.width}px` : props.width || 'auto'};
`;

export const TimePickerTrigger = styled.div<{ focused?: boolean; disabled?: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    padding: 0 12px;
    border: 1px solid ${props => props.disabled ? '#d9d9d9' : props.focused ? '#339af0' : '#d9d9d9'};
    border-radius: 4px;
    background-color: ${props => props.disabled ? '#f5f5f5' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:hover {
        border-color: ${props => props.disabled ? '#d9d9d9' : '#339af0'};
        box-shadow: ${props => props.disabled ? 'none' : '0 0 0 2px rgba(51, 154, 240, 0.2)'};
    }
`;

export const TimePickerValue = styled.span<{ isPlaceholder?: boolean; disabled?: boolean }>`
    flex: 1;
    color: ${props => props.disabled ? '#bfbfbf' : props.isPlaceholder ? '#bfbfbf' : '#262626'};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const TimePickerSuffix = styled.span`
    display: flex;
    align-items: center;
    margin-left: 8px;
    color: #bfbfbf;
    transition: all 0.3s ease;
`;

export const TimePickerClear = styled.span<{ visible?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    color: #bfbfbf;
    cursor: pointer;
    border-radius: 50%;
    background-color: #f5f5f5;
    transition: all 0.3s ease;
    opacity: ${props => props.visible ? 1 : 0};
    visibility: ${props => props.visible ? 'visible' : 'hidden'};

    &:hover {
        color: #8c8c8c;
        background-color: #e8e8e8;
    }
`;

export const TimePickerIcon = styled.span<{ open?: boolean }>`
    font-size: 12px;
    transition: transform 0.3s ease;
    transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(0)'};
`;

export const TimePickerDropdown = styled.div<{ top: number; left: number; minWidth: number }>`
    position: absolute;
    top: ${props => props.top}px;
    left: ${props => props.left}px;
    z-index: 9;
    margin-top: 4px;
    min-width: ${props => props.minWidth}px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    overflow: hidden;
`;

export const TimePickerPanel = styled.div`
    display: flex;
    width: 180px;
    height: 224px;
`;

export const TimeColumn = styled.div`
    flex: 1;
    position: relative;
    border-right: 1px solid #f0f0f0;
    overflow: hidden;

    &:last-child {
        border-right: none;
    }
`;

export const TimeColumnHeader = styled.div`
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
    color: #8c8c8c;
    border-bottom: 1px solid #f0f0f0;
    background-color: #fafafa;
`;

export const TimeColumnList = styled.div`
    height: 192px;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #d9d9d9;
        border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: #bfbfbf;
    }
`;

export const TimeOption = styled.div<{ selected?: boolean; disabled?: boolean }>`
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    color: ${props => props.disabled ? '#bfbfbf' : props.selected ? '#1890ff' : '#262626'};
    background-color: ${props => props.selected ? '#e6f7ff' : 'transparent'};
    font-weight: ${props => props.selected ? 500 : 400};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${props => props.disabled ? 'transparent' : props.selected ? '#e6f7ff' : '#f5f5f5'};
    }
`;

export const TimePickerLabel = styled.span`
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    flex-shrink: 0;
`;

export const TimePickerWithLabel = styled.div`
    display: flex;
    align-items: center;
`;
