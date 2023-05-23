import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { IconList } from "./ui/IconList";
import { Camera20Filled } from "@fluentui/react-icons";
import { useScreenshot, createFileName } from "./util/useScreenshot";

function App() {
  let [files, setFiles] = React.useState<Array<Object>>([]);
  let [urls, setUrls] = React.useState<Array<string>>([]);

  let __addDirectory = (node: any) => {};

  let __onUploadhandler = (node: any) => {
    let localFiles = node.target.files;

    let filteredFiles = [...localFiles].filter(
      (file: any) => file.name !== ".DS_Store"
    );
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });

    let sortedFiles: any = Object.values(filteredFiles).sort(
      (a: any, b: any) => {
        return collator.compare(a.name, b.name);
      }
    );
    setFiles(sortedFiles);

    let localUrls: Array<string> = [];
    for (let i = 0; i < sortedFiles.length; i++) {
      localUrls.push(URL.createObjectURL(sortedFiles[i]));
    }
    setUrls(localUrls);
  };

  const ref = useRef(null);
  const [image, setImage, takeScreenShot] = useScreenshot();

  const download = (image: any) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "cc.screenshot.png";
    a.click();
  };

  const getScreenShot = () => {
    try {
      setImage(undefined);
      takeScreenShot(ref.current);
    } catch {}
  };

  useEffect(() => {
    if (image) {
      download(image);
    }
  }, [image]);

  let button = (
    <button
      type="button"
      onClick={getScreenShot}
      className="btn btn-primary"
      style={{ marginLeft: "2rem", height: "35px" }}
    >
      <Camera20Filled />
    </button>
  );

  return (
    <div className="App" ref={ref}>
      <div id="app" style={{ paddingBottom: "1rem" }}>
        <header className="App-header">
          <div className="container">
            <div className="row">
              <h1>Fluent Icon Updates</h1>
            </div>
            <div className="row">
              <h4>
                Using @fluentui/react-icons
                {process.env.REACT_APP_FLUENT_ICONS_VERSION}
              </h4>
            </div>
            <div className="row">
              <h4>
                <span className="instructions">
                  Add the ability to take a screenshot of entire website to this
                  button -&gt;{" "}
                </span>
                {button}
              </h4>{" "}
            </div>
          </div>
        </header>

        {urls.length > 0 && <div style={{ paddingBottom: "2rem" }}></div>}

        <div id="iconList">
          <img src={require("./assets/diff.jpg")} alt="" />
          <IconList urls={urls} files={files} />{" "}
        </div>
      </div>
    </div>
  );
}

export default App;
