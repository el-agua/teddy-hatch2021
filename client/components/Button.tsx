import { FC } from "react";

interface ButtonProps {
  color?: string
  textColor?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  onClick?: any
  padd?: string
}
const Button: FC<ButtonProps> = (props) => {
  const classData: string = `bg-${props.color} 
    text-lg
    text-${props.textColor ? props.textColor : "black"}
    h-auto 
    w-max 
    transition
    transform
    duration-700
    hover:scale-110
    text-center 
    font-rob 
    pt-${props.padd ? props.padd : "2"}
    pb-${props.padd ? props.padd : "2"}
    px-4
    rounded-lg
    focus:outline-none
    active:opacity-75`;
  return (
    <button onClick={props.onClick} className={classData} disabled={props.disabled} type={props.type}>
      {props.children}
    </button>
  );
};

export default Button;
