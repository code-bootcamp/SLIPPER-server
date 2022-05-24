// import { Module } from '@nestjs/common';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Board } from '../Board/board.entity';
// import { BoardService } from '../Board/board.service';
// import { BoardImage } from '../BoardImage/boardImage.entity';
// import { Join } from '../join/entities/join.entity';
// import { BusinessUserResolver } from './businessUser.resolver';

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([Board, BoardImage, Join]),
//     ElasticsearchModule.register({
//       node: 'http://elasticsearch:9200',
//     }),
//   ],
//   providers: [
//     BusinessUserResolver, //
//     BoardService,
//   ],
// })
// export class BusinessUserModule {}
