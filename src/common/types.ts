
type PRIVATE_DID_TYPE =
    {
        private:
        {
            public_key: Uint8Array | undefined;
            identity: string;
            metadata: string;
        }
    };

export { PRIVATE_DID_TYPE };