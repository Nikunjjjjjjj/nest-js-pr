import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: any;

  constructor(private configService: ConfigService) {
    // Get the Azure connection string from the environment
    //const connectionString = this.configService.get<string>(process.env.connection_string);
    this.blobServiceClient = BlobServiceClient.fromConnectionString("connectionString");
    this.containerClient = this.blobServiceClient.getContainerClient('media-files');//your-container-name
  }

  async uploadFile(file) {
    const blobName = path.basename(file.originalname);
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.uploadData(file.buffer);
    return uploadBlobResponse;
  }
}
