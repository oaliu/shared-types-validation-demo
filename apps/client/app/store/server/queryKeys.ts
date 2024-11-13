const queryKeys = {
  authUser: ["authUser"],
  product: {
    list: ["product", "list"],
    details: (id: string) => ["product", "details", id],
  },
};

export default queryKeys;
