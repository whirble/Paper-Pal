'use client'
import React from 'react'
import {ReactTyped} from 'react-typed'


type Props = {
  string: string[],
  delay:number,
  cursor: boolean
}

const TypeEffect = (props: Props) => {
    
    return (
            <ReactTyped
              strings={props.string}
              typeSpeed={50} // Typing speed in milliseconds
              backSpeed={30} // Speed for deleting typos (if loop is enabled)
            //   loop // Whether to loop through the strings indefinitely
              startDelay={props.delay}
              showCursor={props.cursor} // This line hides the typing symbol
            />
              
    )

}

export default TypeEffect;