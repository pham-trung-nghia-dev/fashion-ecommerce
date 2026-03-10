<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use App\Models\Category;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
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

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedShoppingBag;

    protected static ?string $navigationLabel = 'Sản phẩm';

    protected static ?string $modelLabel = 'Sản phẩm';

    protected static ?string $pluralModelLabel = 'Sản phẩm';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin sản phẩm')
                    ->schema([
                        Select::make('primary_category_id')
                            ->label('Loại sản phẩm (Nam/Nữ)')
                            ->options(fn () => Category::query()
                                ->whereIn('slug', ['do-nam', 'do-nu'])
                                ->orderBy('sort_order')
                                ->pluck('name', 'id')
                            )
                            ->required(),

                        TextInput::make('name')
                            ->label('Tên sản phẩm')
                            ->required()
                            ->maxLength(255),

                        TextInput::make('sub_title')
                            ->label('Phụ đề')
                            ->maxLength(255),

                        TextInput::make('sku')
                            ->label('Mã sản phẩm')
                            ->required()
                            ->maxLength(100)
                            ->unique(ignoreRecord: true),

                        TextInput::make('price')
                            ->label('Giá')
                            ->numeric()
                            ->minValue(0)
                            ->required(),

                        TextInput::make('old_price')
                            ->label('Giá gốc (gạch ngang)')
                            ->numeric()
                            ->minValue(0),

                        TextInput::make('discount')
                            ->label('Giảm giá (%)')
                            ->numeric()
                            ->minValue(0)
                            ->maxValue(100),

                        TextInput::make('stock')
                            ->label('Tồn kho')
                            ->numeric()
                            ->minValue(0)
                            ->required(),

                        Select::make('categories')
                            ->label('Tag (HOT, ...)')
                            ->multiple()
                            ->options(fn () => Category::query()
                                ->whereNotIn('slug', ['do-nam', 'do-nu'])
                                ->orderBy('sort_order')
                                ->pluck('name', 'id')
                            )
                            ->preload()
                            ->searchable()
                            ->relationship('categories', 'name'),

                        Textarea::make('description')
                            ->label('Mô tả')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Trạng thái')
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Đang bán')
                            ->default(true),
                        Toggle::make('is_new')
                            ->label('Hàng mới')
                            ->default(false),
                    ])
                    ->columns(2),

                Section::make('Hình ảnh')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Hình sản phẩm')
                            ->image()
                            ->directory('products/images')
                            ->disk('public')
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('800')
                            ->imageResizeTargetHeight('800'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Tên')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                ImageColumn::make('image')
                    ->label('Hình')
                    ->disk('public')
                    ->height(80)
                    ->width(80),

                TextColumn::make('sku')
                    ->label('Mã')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND', locale: 'vi_VN')
                    ->sortable(),

                TextColumn::make('stock')
                    ->label('Tồn kho')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Đang bán')
                    ->boolean(),

                IconColumn::make('is_new')
                    ->label('Mới')
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}

