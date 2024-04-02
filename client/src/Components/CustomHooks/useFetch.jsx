import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserAuthCtx } from "../../Store/Context/UserAuthContext";
export default function useFetch(url, method, Token,body) {
  const [data, setData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const { setLogedIn } = useContext(UserAuthCtx);
  useEffect(() => {
    const FetchFunc = async()=>{
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
          },
          body
        });
        const res = await response.json();
        setData(res);
        setLoading(false);
        if(res.status !== 'success'){
          setLogedIn(false)
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    FetchFunc();
  },[url])
  return {data, Loading};
}