<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PostResource\Pages;
use App\Models\Post;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class PostResource extends Resource
{
    protected static ?string $model = Post::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static ?string $navigationLabel = 'Tin tức';

    protected static ?string $modelLabel = 'Tin tức';

    protected static ?string $pluralModelLabel = 'Tin tức';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Nội dung tin tức')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, ?string $state, callable $set) {
                                if ($operation === 'create' && $state) {
                                    $set('slug', Str::slug($state));
                                }
                            }),

                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255)
                            ->disabled(fn (string $operation): bool => $operation === 'edit')
                            ->dehydrated(),

                        TextInput::make('excerpt')
                            ->label('Mô tả ngắn (list)')
                            ->maxLength(500)
                            ->columnSpanFull(),

                        RichEditor::make('content')
                            ->required()
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Hình ảnh')
                    ->schema([
                        FileUpload::make('thumbnail')
                            ->image()
                            ->directory('posts/thumbnails')
                            ->disk('public'),
                    ]),

                Section::make('Trạng thái')
                    ->schema([
                        Toggle::make('status')
                            ->label('Hiển thị')
                            ->default(true)
                            ->live(),

                        DateTimePicker::make('published_at')
                            ->label('Ngày đăng')
                            ->rules([
                                fn (callable $get): \Closure => function (string $attribute, $value, \Closure $fail) use ($get) {
                                    if (! $get('status') && $value && now()->lt($value)) {
                                        $fail('Cannot set a future publish date when status is inactive.');
                                    }
                                },
                            ]),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                TextColumn::make('excerpt')
                    ->label('Mô tả ngắn')
                    ->limit(40)
                    ->toggleable(),

                IconColumn::make('status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->label('Trạng thái'),

                TextColumn::make('published_at')
                    ->label('Ngày đăng')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->placeholder('—'),

                TextColumn::make('created_at')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                TernaryFilter::make('status')
                    ->label('Status')
                    ->trueLabel('Active')
                    ->falseLabel('Inactive'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPosts::route('/'),
            'create' => Pages\CreatePost::route('/create'),
            'edit' => Pages\EditPost::route('/{record}/edit'),
        ];
    }
}
