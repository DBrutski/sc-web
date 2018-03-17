const ErrorCode = {
    Unknown: 0,
    ItemNotFound: 1,
    ItemAlreadyExists: 2
};

const Debug = {

    code_map: {
        0: "Unknown",
        1: "ItemNotFound",
        2: "ItemAlreadyExists"
    },


    codeToText: function (code) {
        return this.code_map[code];
    },

    /**
     * Function to call, when any error occurs
     * @param {ErrorCode} code Code of error (error type)
     * @param
     */
    error: function (code, message) {
        console.log("Error: " + this.codeToText(code) + ". " + message);
    }
};
export default Debug
export default ErrorCode
