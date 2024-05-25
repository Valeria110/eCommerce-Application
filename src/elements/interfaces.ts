export interface InfoBook {
  masterData: {
    staged: {
      masterVariant: {
        attributes: { name: string; value: string }[];
        images: { url: string }[];
        prices: {
          value: { centAmount: number };
          discounted: { value: { centAmount: number } };
        }[];
      };
      name: {
        'en-US': string;
        ru: string;
      };
    };
  };
}
