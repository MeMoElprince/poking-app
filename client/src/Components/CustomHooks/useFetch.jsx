import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { UserCtx } from "../../Store/Context/UserContext";

export default function useFetch(url, method, body) {
  const [data, setData] = useState(null);
  const [Loading, setLoading] = useState(true);
  const { setLogedIn, Token } = useContext(UserCtx);

  useEffect(() => {
    let cancelled = false;
    const FetchFunc = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
          },
          body,
        });
        const res = await response.json();
        if (cancelled) return;
        setData(res);
        setLoading(false);
        if (res.status !== 'success') setLogedIn(false);
      } catch (error) {
        if (cancelled) return;
        console.error('Error:', error);
        setLoading(false);
        toast('Network error, please check your connection', { theme: 'dark', position: 'top-right', autoClose: 5000, toastId: 'network-error' });
      }
    };

    FetchFunc();
    return () => { cancelled = true; };
    // refetch only when the endpoint or auth token changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, Token]);

  return { data, Loading };
}
