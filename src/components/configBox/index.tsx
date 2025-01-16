import React, { useEffect } from 'react';
import './index.css';
import ReactDOM from 'react-dom';

const configStr = localStorage.getItem("config");
const config = JSON.parse(configStr || "{}");
const ConfigBox: React.FC = () => {
  const [foramData, setFormData] = React.useState<{ aifix: string, [key: string]: unknown }>({
    ...config
  });
  console.log(foramData)
  const [show, setShow] = React.useState(false);
  useEffect(() => {
    window.showConfigBox = (f: Function) => {
      setShow(true);
      window.addEventListener('onclick', function (e) {
        if (e.target !== document.getElementsByClassName('configBox')[0]) {
          setShow(false);
          console.log('11')
        }
      })
      f?.();
    }
    window.closeConfigBox = () => {
      setShow(false)
      window.addEventListener('onClick', function () { })
    }

  }, []);

  const save = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    localStorage.setItem("config", JSON.stringify(foramData))
    setShow(false)
  }
  const clear = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setShow(false)
  }
  return (
    <>
      {ReactDOM.createPortal(<>
        <div className={`mask ${show ? "showMask" : "hiddenMask"}`} onClick={() => { setShow(false) }}></div>
        <div className='configBox' style={{
          top: show ? "30px" : "-400px"
        }}>
          <form>
            <label>
              AI角色提示词
              <textarea
                name="aifix"
                className='aifixTextArea'
                value={foramData.aifix || ""}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, aifix: e.target.value }))
                }} />
            </label>
            <button type="submit" className='configButton' onClick={save}>保存配置</button>
            <button className='configButton configButtonClear' onClick={clear}>取 消</button>
          </form>
        </div>
      </>, document.body)}
    </>
  );
};

export default ConfigBox;