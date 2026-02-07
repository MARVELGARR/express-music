

import { useEffect, useState } from "react"



const useDebounce = (value: string, interval: number = 500) => {

    const [debouncedValue, setDebouncedValue] = useState(value)


    useEffect(()=>{
        const timeOut = setTimeout(() => {
            setDebouncedValue(value)
        }, interval);

        return ()=> clearTimeout(timeOut)
    },[value])

  return {
    debouncedValue
  }
}

export default useDebounce