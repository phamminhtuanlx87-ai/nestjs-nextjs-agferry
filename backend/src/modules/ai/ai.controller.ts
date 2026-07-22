import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('test-filter')
  async testFilter(@Body('question') question: string) {
    // 1. Gọi Gemini để phân tích câu hỏi ra JSON Filter
    const filterQuery = await this.aiService.getMongoFilter(question);

    // 2. Tạm thời trả về JSON Filter để mình kiểm tra xem AI hiểu đúng không
    return {
      userQuestion: question,
      generatedMongoFilter: filterQuery,
    };
  }

  // API MỚI: Luồng chạy hoàn chỉnh 3 bước
  @Post('chat')
  async chat(@Body('question') question: string) {
    return await this.aiService.chatWithAi(question);
  }
}
