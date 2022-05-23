import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Board } from '../Board/board.entity';
import { CreateBoardInput } from '../Board/dto/create_board.input';
import { TestBoardService } from './test.service';

@Resolver()
export class TestAPIResolver {
  constructor(
    private readonly testBoardService: TestBoardService, //
  ) {}

  @Query(() => String)
  testAPI() {
    return '테스트 완료! 접속되었습니다 - slipper!';
  }

  @Query(() => [Board])
  testFetchBoards() {
    return this.testBoardService.findAll();
  }

  @Query(() => [String])
  testFetchBoardsPage(
    @Args('page') page: number, //
    @Args('category') category: string, //
    @Args('search') search: string, //
  ) {
    const result = [];
    const data = {
      _index: 'slipper-elasticsearch',
      _type: '_doc',
      _id: '19d1e9aa-ce47-474d-8590-bd618aa4e83a',
      _score: null,
      _source: {
        likecount: 0,
        place: '프레퍼스',
        id: '19d1e9aa-ce47-474d-8590-bd618aa4e83a',
        nickname: '최성환',
        address: `${search}`,
        createdat: '2022-05-21T11:43:15.000Z',
        thumbnail:
          'https://storage.googleapis.com/slipper-storage/board/9b3fce98-b0da-42fc-a089-24d103ce1a47/penguin3.jpeg',
        category: `${category}`,
        sortdate: 1653100995.844904,
        title: '여기 정말 맛있습니다! 강추!!',
      },
      sort: [1653133395000],
    };

    for (let i = 0; i < 5; i++) {
      result.push(data);
    }
    console.log(result);

    return result;
  }

  @Mutation(() => Board)
  async testCreateBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput, //
    @Args('email') email: string,
  ) {
    const result = await this.testBoardService.create({
      createBoardInput,
      email: email,
    });

    console.log(result);

    return result;
  }
}
