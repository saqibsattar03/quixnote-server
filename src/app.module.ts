import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './common/auth/auth.module';
import { DbModule } from './common/db/db.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CommentModule } from './modules/comment/comment.module';
import { PrivacyPolicyModule } from './modules/privacy-policy/privacy-policy.module';
import { TermsAndConditionsModule } from './modules/terms-and-conditions/terms-and-conditions.module';
import { FaqModule } from './modules/faq/faq.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { NotesModule } from './modules/notes/notes.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './common/utils/fileUpload.util';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '..', '.env'),
    }),
    AuthModule,
    DbModule,
    ProfileModule,
    CommentModule,
    PrivacyPolicyModule,
    TermsAndConditionsModule,
    FaqModule,
    TicketModule,
    NotesModule,
    MulterModule.register(multerConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
