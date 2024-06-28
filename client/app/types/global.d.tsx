interface UpdateCartContextType {
    updateCart: boolean;
    setUpdateCart: React.Dispatch<React.SetStateAction<boolean>>;
}

type PageLoadingType = {
    status: boolean;
};


interface LoadingContextType {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}
