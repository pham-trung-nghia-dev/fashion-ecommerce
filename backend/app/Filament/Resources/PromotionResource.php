<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromotionResource\Pages;
use App\Models\Promotion;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PromotionResource extends Resource
{
    protected static ?string $model = Promotion::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedTicket;

    protected static ?string $navigationLabel = 'Khuyến mãi';

    protected static ?string $modelLabel = 'Khuyến mãi';

    protected static ?string $pluralModelLabel = 'Khuyến mãi';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Nội dung khuyến mãi')
                    ->schema([
                        TextInput::make('title')
                            ->label('Tiêu đề')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->label('Mô tả')
                            ->columnSpanFull(),
                        DateTimePicker::make('start_at')
                            ->label('Bắt đầu'),
                        DateTimePicker::make('end_at')
                            ->label('Kết thúc'),
                        Toggle::make('is_active')
                            ->label('Hiển thị')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->sortable()
                    ->limit(50),
                TextColumn::make('start_at')
                    ->label('Bắt đầu')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                TextColumn::make('end_at')
                    ->label('Kết thúc')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Hiển thị')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->label('Tạo lúc')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([])
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
            'index' => Pages\ListPromotions::route('/'),
            'create' => Pages\CreatePromotion::route('/create'),
            'edit' => Pages\EditPromotion::route('/{record}/edit'),
        ];
    }
}
