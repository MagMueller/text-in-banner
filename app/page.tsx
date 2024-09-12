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
        // Temporarily hide the profile picture placeholder
        ctx.globalAlpha = 1;
        drawCanvas(false);
      }
      const link = document.createElement('a');
      link.download = 'linkedin-banner-with-text.png';
      link.href = canvas.toDataURL();
      link.click();
      // Redraw the canvas with the profile picture placeholder
      drawCanvas(true);
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

    if (selectedBoxStyle.name !== "None") {
      // Draw box
      ctx.fillStyle = boxColor;
      ctx.beginPath();
      const path = new Path2D(selectedBoxStyle.path(boxWidth, boxHeight));
      ctx.fill(path);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 2;
      ctx.stroke(path);
    }

    // Add text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${20 * (boxSize / 100)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = bubbleText.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(line, boxWidth / 2, (30 + index * 30) * (boxSize / 100));
    });

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
            const avatarSize = 200; // Increased size
            const avatarX = 20;
            const avatarY = 350 - avatarSize + 30; // 30px overlap

            // Draw white circle for border
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 5, 0, 2 * Math.PI);
            ctx.fillStyle = "#FFFFFF";
            ctx.fill();

            // Clip the avatar area
            ctx.save();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
            ctx.clip();

            // Draw part of the background image as avatar
            ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize, avatarX, avatarY, avatarSize, avatarSize);

            // Restore clipping
            ctx.restore();

            // Draw semi-transparent overlay
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.globalAlpha = 1;

            // Draw user icon
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2 - 20, avatarSize / 6, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 50, avatarSize / 3, Math.PI, 2 * Math.PI);
            ctx.fill();
          }
        };
        img.src = uploadedImage;
      }
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [uploadedImage, bubbleText, boxColor, textColor, boxPosition, selectedBoxStyle, boxSize]);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">LinkedIn Banner Photo Editor</h1>
      
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
            <div className="flex gap-4 justify-center items-center flex-wrap">
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
            <Textarea
              value={bubbleText}
              onChange={(e) => setBubbleText(e.target.value)}
              placeholder="Enter text for the banner"
              className="mt-2"
              rows={2}
            />
            <div className="flex justify-between">
              <Button onClick={handleBackClick}>Back</Button>
              <Button onClick={handleDownload}>Download Image</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
