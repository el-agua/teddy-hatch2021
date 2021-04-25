import React, { FC } from "react";

interface CardProps {
  color?: string
  width?: string
  titleAlign?: string
  title?: string
}
const Card: FC<CardProps> = (props: any) => {
  const classData = `bg-${props.color ? props.color : "white"} 
      h-auto 
      w-${props.width ? props.width : "full"}
      justify-self-center
      shadow-md
      font-rob 
      p-6
      rounded-lg`;
  return (
    <div className={classData}>
      { props.title ?
        <div
          id="title"
          className={`text-${props.titleAlign ? props.titleAlign : "left"
            } text-3xl mb-3`}
        >
          <strong>{props.title}</strong>
        </div> : <div></div>
      }
      <div id="body">{props.children}</div>
    </div>
  );
}

export default Card
