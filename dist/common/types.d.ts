declare type PRIVATE_DID_TYPE = {
    private: {
        public_key: Uint8Array | undefined;
        identity: String;
        metadata: String;
    };
};
export { PRIVATE_DID_TYPE };
