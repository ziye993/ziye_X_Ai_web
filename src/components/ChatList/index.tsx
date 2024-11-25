import React from 'react';
import './index.css';
import { IListItem } from '../../App';


interface IProps {
  current: number;
  list: IListItem[];
  setCurrent: (pre: number) => void;
  clearChat: (pid?: string) => void;
}
const ChatTool: React.FC<IProps> = (props: IProps) => {

  return (
    <div className='chatListContainer'>
      {props.list.map((item, index) => {
        return <div className='listContainerItem' key={`list_${index}`} onClick={() => {
          props.setCurrent(index)
        }}>
          <span>{(index + 1) + ` `}</span>
          <span className='listTitle'>{item.cach?.[0]?.content || "空会话"}</span>
          <span className='listClearButton' onClick={() => {
            props.clearChat(item.id)
          }}>X</span>
        </div>
      })}
    </div>

  );
};

export default ChatTool;