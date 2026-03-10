<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobResource\Pages;
use App\Models\Job;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
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

class JobResource extends Resource
{
    protected static ?string $model = Job::class;

    protected static string | \BackedEnum | null $navigationIcon = Heroicon::OutlinedBriefcase;

    protected static ?string $navigationLabel = 'Tuyển dụng';

    protected static ?string $modelLabel = 'Tin tuyển dụng';

    protected static ?string $pluralModelLabel = 'Tuyển dụng';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Thông tin tuyển dụng')
                    ->schema([
                        TextInput::make('title')
                            ->label('Vị trí / Chức danh')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('location')
                            ->label('Địa điểm')
                            ->maxLength(255),
                        Textarea::make('description')
                            ->label('Mô tả')
                            ->columnSpanFull(),
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
                    ->label('Vị trí')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                TextColumn::make('location')
                    ->label('Địa điểm')
                    ->limit(30),
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
            'index' => Pages\ListJobs::route('/'),
            'create' => Pages\CreateJob::route('/create'),
            'edit' => Pages\EditJob::route('/{record}/edit'),
        ];
    }
}
