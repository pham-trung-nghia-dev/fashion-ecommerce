<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static ?string $navigationLabel = 'Banner (Slider)';

    protected static ?string $modelLabel = 'Banner';

    protected static ?string $pluralModelLabel = 'Banner';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Hình ảnh banner')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Hình ảnh')
                            ->image()
                            ->directory('banners')
                            ->disk('public')
                            ->required(),
                    ]),
                Section::make('Thứ tự & trạng thái')
                    ->schema([
                        TextInput::make('sort_order')
                            ->label('Thứ tự')
                            ->numeric()
                            ->default(0),
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
                ImageColumn::make('image')
                    ->label('Hình')
                    ->disk('public')
                    ->height(60)
                    ->width(100),
                TextColumn::make('sort_order')
                    ->label('Thứ tự')
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
            ->defaultSort('sort_order')
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
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
