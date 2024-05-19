import React, { useState, useEffect, useRef } from "react";
import { CirclePicker } from "react-color";
import "./CanvasEditor.css";

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [templateData, setTemplateData] = useState({
    caption: {
      text: "Treat Yourself to a divine Blueberry Cake",
      position: { x: 80, y: 100 },
      maxCharactersPerLine: 31,
      fontSize: 44,
      alignment: "left",
      textColor: "#000000",
    },
    cta: {
      text: "Contact Us",
      position: { x: 100, y: 250 },
      textColor: "#000000",
      backgroundColor: "white",
    },
    imageMask: {
      x: 50,
      y: 400,
      width: 980,
      height: 700,
    },
    drawMaskStroke: {
      x: -1,
      y: -70,
      width: 1080,
      height: 1150,
    },

    urls: {
      mask: "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png",
      stroke:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png",
      designPattern:
        "https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png",
    },
  });
  const [backgroundColor, setBackgroundColor] = useState("#0369A1");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    drawTemplate();
  }, [templateData, backgroundColor, selectedImage]);

  const drawTemplate = () => {
    ctxRef.current.clearRect(0, 0, 1080, 1080);
    drawBackground(backgroundColor);
    drawDesignPattern();
    drawMaskStroke();
    drawCaption();
    drawCTA();
    drawImage();
  };

  const drawBackground = (color) => {
    ctxRef.current.fillStyle = color;
    ctxRef.current.fillRect(0, 0, 1080, 1080);
  };

  const drawDesignPattern = () => {
    const image = new Image();
    image.src = templateData.urls.designPattern;
    image.onload = () => {
      ctxRef.current.drawImage(image, 0, 0, 1080, 1080);
    };
  };

  const drawMaskStroke = () => {
    const image = new Image();
    image.src = templateData.urls.stroke;
    image.onload = () => {
      ctxRef.current.drawImage(
        image,
        templateData.drawMaskStroke.x,
        templateData.drawMaskStroke.y,
        templateData.drawMaskStroke.width,
        templateData.drawMaskStroke.height
      );
    };
  };

  const drawCaption = () => {
    ctxRef.current.font = `${templateData.caption.fontSize}px Arial`;
    ctxRef.current.fillStyle = templateData.caption.textColor;
    ctxRef.current.textAlign = templateData.caption.alignment;
    ctxRef.current.textBaseline = "top";
    wrapText(
      ctxRef.current,
      templateData.caption.text,
      templateData.caption.position.x,
      templateData.caption.position.y,
      templateData.caption.maxCharactersPerLine
    );
  };

  const drawCTA = () => {
    ctxRef.current.font = `30px Arial`;
    ctxRef.current.fillStyle = templateData.cta.textColor;
    ctxRef.current.fillStyle = ctxRef.current.textAlign = "center";
    ctxRef.current.textBaseline = "middle";
    ctxRef.current.fillStyle = templateData.cta.backgroundColor;
    ctxRef.current.fillRect(
      templateData.cta.position.x,
      templateData.cta.position.y,
      200,
      70
    );
    ctxRef.current.fillStyle = templateData.cta.textColor;
    ctxRef.current.fillText(
      templateData.cta.text,
      templateData.cta.position.x + 100,
      templateData.cta.position.y + 25
    );
  };

  const drawImage = () => {
    if (selectedImage) {
      ctxRef.current.drawImage(
        selectedImage,
        templateData.imageMask.x,
        templateData.imageMask.y,
        templateData.imageMask.width,
        templateData.imageMask.height
      );
    }
  };

  const wrapText = (ctx, text, x, y, maxCharactersPerLine) => {
    const words = text.split("  ");
    let line = " ";
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxCharactersPerLine) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setSelectedImage(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleCaptionChange = (event) => {
    setTemplateData({
      ...templateData,
      caption: {
        ...templateData.caption,
        text: event.target.value,
      },
    });
  };

  const handleCTAChange = (event) => {
    setTemplateData({
      ...templateData,
      cta: {
        ...templateData.cta,
        text: event.target.value,
      },
    });
  };

  return (
    <div className="canvas-editor">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          height="1080"
          width="1080"
          style={{ height: 400, width: 500 }}
        />
      </div>
      <div className="controls">
        <div className="control-group">
          <label htmlFor="">
            <h2>Ad Customaztion</h2>
          </label>
          <br />
          <label htmlFor="">
            Customise Your ad and get the templates accordingly
          </label>
          <br />
          <br />

          <div className="control-group">
            <label htmlFor="image-input">Change the ad creative image. </label>
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <br />
          <label htmlFor="" className="hr-lines">
            Edit Contents
          </label>
          <br />
          <br />

          <div className="control-group">
            <label htmlFor="caption-input" className="Customaztion">
              Ad Content :
            </label>
            <input
              type="text"
              id="caption-input"
              value={templateData.caption.text}
              onChange={handleCaptionChange}
            />
          </div>
          <div className="control-group">
            <label htmlFor="cta-input" className="Customaztion">
              CTA :
            </label>
            <input
              type="text"
              id="cta-input"
              value={templateData.cta.text}
              onChange={handleCTAChange}
            />
          </div>
          <label
            htmlFor="background-color-picker"
            className="BackgroundCustomaztion"
          >
            Choose your color:
          </label>
          <CirclePicker
            id="background-color-picker"
            className="BackgroundColorCustomaztion"
            color={backgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </div>
      </div>
    </div>
  );
};

const ColorPicker = ({ id, color, onChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);

  useEffect(() => {
    onChange({ hex: selectedColor });
  }, [selectedColor]);

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    setIsPickerOpen(false);
  };

  return (
    <div className="color-picker">
      <input type="text" id={id} value={selectedColor} readOnly />
      <button onClick={() => setIsPickerOpen(!isPickerOpen)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM8 14C10.7614 14 13 11.7614 13 9C13 6.23858 10.7614 4 8 4C5.23858 4 3 6.23858 3 9C3 11.7614 5.23858 14 8 14Z"
            fill="#fff"
          />
        </svg>
      </button>
      {isPickerOpen && (
        <ColorPickerPopup
          onClose={() => setIsPickerOpen(false)}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
};

const ColorPickerPopup = ({ onClose, onColorChange }) => {
  const handleColorClick = (color) => {
    onColorChange(color);
    onClose();
  };
};
export default CanvasEditor;
