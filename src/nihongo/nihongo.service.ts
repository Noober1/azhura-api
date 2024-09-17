import { Injectable } from '@nestjs/common';

@Injectable()
export class NihongoService {
  constructor() {}

  rootPage() {
    return {
      text: 'hello Nihongo',
    };
  }
}
