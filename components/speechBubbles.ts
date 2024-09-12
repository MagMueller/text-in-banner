export const speechBubbles = [
  {
    name: "Round Box",
    path: (w: number, h: number) => `M20,0 L${w-20},0 Q${w},0 ${w},20 L${w},${h-20} Q${w},${h} ${w-20},${h} L20,${h} Q0,${h} 0,${h-20} L0,20 Q0,0 20,0 Z`
  },
  {
    name: "Speech Bubble",
    path: (w: number, h: number) => `M10,0 L${w-10},0 Q${w},0 ${w},10 L${w},${h-10} Q${w},${h} ${w-10},${h} L20,${h} L0,${h+30} L20,${h} L10,${h} Q0,${h} 0,${h-10} L0,10 Q0,0 10,0 Z`
  },
  {
    name: "Only Text",
    path: () => ""
  }
];