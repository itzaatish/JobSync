import { createContext , useState } from "react";

const LoadingContext = createContext({
    isLoading: false,
    setLoading: (state) => {}
});

export default LoadingContext;

export const LoadingProvider = ({ children }) => {
    const [isLoading , setisLoading] = useState(false);

    const setLoading = (loadingState) => {
        setisLoading(loadingState);
    }

    return(
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}