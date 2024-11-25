import React from 'react';
import './index.css';


interface IProps {
  clearChat: () => void;
  newChat: () => void;
  setConfig: () => void;
  clearAllChat: () => void;
}
const ChatTool: React.FC<IProps> = (props: IProps) => {

  // const clearButton = () => {
  //   // 清除消息
  //   localStorage.removeItem("cacheMessages")
  // };
  return (
    <div className='toolContainer'>
      <div></div>
      <div className='toolContainerItem' onClick={props.newChat}>
        <span>N</span><span>新会话</span>
      </div>
      <div className='toolContainerItem' onClick={()=>props.clearChat()}>
        <span>C</span><span>清除</span>
      </div>
      <div className='toolContainerItem' onClick={props.setConfig}>
        <span>A</span><span>配置对话</span>
      </div>
      <div className='toolContainerItem' onClick={props.clearAllChat}>
        <span>CA</span><span>清除所有</span>
      </div>
    </div>

  );
};

export default ChatTool;