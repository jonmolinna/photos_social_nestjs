import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dhdxq3mkm',
      api_key: '214764479396983',
      api_secret: 'JQScXvPaP5QD9fNh12OdG7t5UO8',
    });
  },
};
