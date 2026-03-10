<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StoreResource\Pages;
use App\Models\Store;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class StoreResource extends Resource
{
    protected static ?string $model = Store::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedBuildingStorefront;

    protected static ?string $navigationLabel = 'Cửa hàng';

    protected static ?string $modelLabel = 'Cửa hàng';

    protected static ?string $pluralModelLabel = 'Hệ thống cửa hàng';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin cửa hàng')
                    ->schema([
                        TextInput::make('name')
                            ->label('Tên cửa hàng')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('address')
                            ->label('Địa chỉ')
                            ->columnSpanFull(),
                        TextInput::make('phone')
                            ->label('Hotline'),
                        TextInput::make('sort_order')
                            ->label('Thứ tự')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Tên')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('address')
                    ->label('Địa chỉ')
                    ->limit(40),
                TextColumn::make('phone')
                    ->label('Hotline'),
                TextColumn::make('sort_order')
                    ->label('Thứ tự')
                    ->sortable(),
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
            'index' => Pages\ListStores::route('/'),
            'create' => Pages\CreateStore::route('/create'),
            'edit' => Pages\EditStore::route('/{record}/edit'),
        ];
    }
}
