"use client";

import { ImageUpload } from "@/components/image-upload";
import { speechBubbles } from "@/components/speechBubbles";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const boxStyles = [
  { name: "Round Box", icon: MessageSquare, path: speechBubbles[0].path },
  { name: "Speech Bubble", icon: MessageCircle, path: speechBubbles[1].path },
  { name: "None", icon: null, path: speechBubbles[2].path },
];

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [bubbleText, setBubbleText] = useState("100% AI generated\nRealFakePhotos.com");
  const [boxColor, setBoxColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [boxPosition, setBoxPosition] = useState({ x: 50, y: 50 });
  const [selectedBoxStyle, setSelectedBoxStyle] = useState(boxStyles[0]);
  const [boxSize, setBoxSize] = useState(100);
  const [transparency, setTransparency] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDraggingRef = useRef(false);

  const handleImageUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleBackClick = () => {
    setUploadedImage(null);
    setBubbleText("100% AI generated\nRealFakePhotos.com");
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create a new canvas for the download
        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = 1400;
        downloadCanvas.height = 350;
        const downloadCtx = downloadCanvas.getContext('2d');
        
        if (downloadCtx) {
          // Draw only the background image and text
          const img = new Image();
          img.onload = () => {
            downloadCtx.drawImage(img, 0, 0, 1400, 350);
            drawTextAndBox(downloadCtx);
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'linkedin-banner-with-text.png';
            link.href = downloadCanvas.toDataURL();
            link.click();
          };
          img.src = uploadedImage as string;
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= boxPosition.x && x <= boxPosition.x + 300 &&
          y >= boxPosition.y && y <= boxPosition.y + 100) {
        isDraggingRef.current = true;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setBoxPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const drawTextAndBox = (ctx: CanvasRenderingContext2D) => {
    const boxWidth = 300 * (boxSize / 100);
    const boxHeight = 100 * (boxSize / 100);

    ctx.translate(boxPosition.x, boxPosition.y);
    ctx.globalAlpha = transparency / 100;

    if (selectedBoxStyle.name !== "None") {
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.beginPath();
      const path = new Path2D(selectedBoxStyle.path(boxWidth, boxHeight));
      ctx.fill(path);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 3;
      ctx.stroke(path);
    }

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${20 * (boxSize / 100)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = bubbleText.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, boxWidth / 2, boxHeight / 2 + (index - (lines.length - 1) / 2) * 30 * (boxSize / 100));
    });

    ctx.globalAlpha = 1;
    ctx.resetTransform();
  };

  const drawCanvas = (includeProfilePlaceholder: boolean = true) => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = 1400;
          canvas.height = 350;
          ctx.drawImage(img, 0, 0, 1400, 350);

          drawTextAndBox(ctx);

          if (includeProfilePlaceholder) {
            // Draw profile picture placeholder
            const avatarSize = 250;
            const avatarX = 50; // Moved further to the left
            const avatarY = 350 - avatarSize + 50; // 50px overlap

            ctx.fillStyle = "#E0E0E0";
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 5;
            ctx.stroke();

            // Draw user icon
            const iconSize = avatarSize * 0.6;
            const iconX = avatarX + (avatarSize - iconSize) / 2;
            const iconY = avatarY + (avatarSize - iconSize) / 2;
            
            ctx.fillStyle = "#A0A0A0";
            ctx.beginPath();
            ctx.arc(iconX + iconSize / 2, iconY + iconSize / 3, iconSize / 3, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(iconX, iconY + iconSize);
            ctx.quadraticCurveTo(iconX + iconSize / 2, iconY + iconSize * 1.2, iconX + iconSize, iconY + iconSize);
            ctx.quadraticCurveTo(iconX + iconSize / 2, iconY + iconSize * 0.8, iconX, iconY + iconSize);
            ctx.fill();
          }
        };
        img.src = uploadedImage;
      }
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [uploadedImage, bubbleText, boxColor, textColor, boxPosition, selectedBoxStyle, boxSize, transparency]);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Write text in LinkedIn banner</h1>
      
      <div className="w-full max-w-[1400px] space-y-4">
        {!uploadedImage ? (
          <>
            <ImageUpload onImageUpload={handleImageUpload} onClick={handleButtonClick} />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              onClick={handleButtonClick} 
              className="w-full py-6 text-lg"
            >
              Select Image
            </Button>
          </>
        ) : (
          <>
            <div className="relative w-full h-[350px]">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full cursor-move" 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>
            <Textarea
              value={bubbleText}
              onChange={(e) => setBubbleText(e.target.value)}
              placeholder="Enter text for the banner"
              className="mt-2 text-lg"
              rows={2}
            />
            <div className="flex flex-col gap-4 items-center">
              <div className="flex gap-2">
                {boxStyles.map((style) => (
                  <Button
                    key={style.name}
                    onClick={() => setSelectedBoxStyle(style)}
                    variant={selectedBoxStyle.name === style.name ? "default" : "outline"}
                    className="px-2 py-1"
                  >
                    {style.icon && <style.icon className="mr-1 h-4 w-4" />}
                    {style.name}
                  </Button>
                ))}
              </div>
              <div className="w-64">
                <label htmlFor="boxSize" className="block mb-2">Text Size:</label>
                <Slider
                  id="boxSize"
                  min={50}
                  max={150}
                  step={1}
                  value={[boxSize]}
                  onValueChange={(value) => setBoxSize(value[0])}
                />
              </div>
              <div className="w-64">
                <label htmlFor="transparency" className="block mb-2">Transparency:</label>
                <Slider
                  id="transparency"
                  min={0}
                  max={100}
                  step={1}
                  value={[transparency]}
                  onValueChange={(value) => setTransparency(value[0])}
                />
              </div>
              <div className="flex gap-4">
                {selectedBoxStyle.name !== "None" && (
                  <div>
                    <label htmlFor="boxColor" className="mr-2">Box Color:</label>
                    <input
                      type="color"
                      id="boxColor"
                      value={boxColor}
                      onChange={(e) => setBoxColor(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="textColor" className="mr-2">Text Color:</label>
                  <input
                    type="color"
                    id="textColor"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleBackClick} className="px-8 py-4 text-lg">Back</Button>
              <Button onClick={handleDownload} className="px-8 py-4 text-lg">Download Image</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
