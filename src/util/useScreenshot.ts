import { useState } from "react";
import html2canvas from "html2canvas";

const useScreenshot = ({ type = undefined, quality = undefined } = {}) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const takeScreenShot = (node: HTMLElement) => {
    if (!node) {
      throw new Error("Wrong html node.");
    }
    return html2canvas(node)
      .then((canvas) => {
        const croppedCanvas = document.createElement("canvas");
        const croppedCanvasContext: any = croppedCanvas.getContext("2d");

        const cropPositionTop = 0;
        const cropPositionLeft = 0;
        const cropWidth = canvas.width;
        const cropHeight = canvas.height;

        croppedCanvas.width = cropWidth;
        croppedCanvas.height = cropHeight;

        croppedCanvasContext.drawImage(
          canvas,
          cropPositionLeft,
          cropPositionTop
        );

        const base64Image: any = croppedCanvas.toDataURL(type, quality);

        setImage(base64Image);
        return base64Image;
      })
      .catch(setError);
  };

  return [
    image,
    setImage,
    takeScreenShot,
    {
      error,
    },
  ];
};

export { useScreenshot };
