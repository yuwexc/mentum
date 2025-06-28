<?php

namespace Database\Seeders;

use App\Models\Topic;
use App\Models\User;
use App\Models\CommunityRole;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Topic::factory(80)->create();

        // User::factory(10)->create();

        // $categories = [
        //     // Основные категории
        //     'Бизнес' => 'business',
        //     'Домашние и дикие животные' => 'animals',
        //     'Кулинария, рецепты' => 'cooking',
        //     'Медицина' => 'medicine',
        //     'Недвижимость' => 'real_estate',
        //     'Образование' => 'education',
        //     'Объявления' => 'ads',
        //     'Поиск работы' => 'jobs',
        //     'Страхование' => 'insurance',
        //     'Туризм, путешествия' => 'travel',
        //     'Финансы' => 'finance',

        //     // Авто и транспорт
        //     'Авто, мото' => 'auto',
        //     'Автовладельцы' => 'car_owners',
        //     'Автомобили' => 'cars',
        //     'Велосипеды' => 'bicycles',
        //     'Водный транспорт' => 'water_transport',
        //     'Мототехника' => 'motorcycles',

        //     // Города и места
        //     'Города, страны' => 'cities_countries',
        //     'Городское сообщество' => 'urban_community',
        //     'Место отдыха' => 'recreation',
        //     'Страна' => 'country',

        //     // Дом и ремонт
        //     'Дом, ремонт' => 'home_improvement',
        //     'Дизайн интерьера' => 'interior_design',
        //     'Садоводство' => 'gardening',
        //     'Строительство, ремонт' => 'construction',

        //     // Технологии
        //     'Компьютер, интернет' => 'it',
        //     'Видеоигры' => 'gaming',
        //     'Мобильные технологии' => 'mobile',
        //     'Программирование' => 'programming',
        //     'Программное обеспечение' => 'software',
        //     'Сайты' => 'web',
        //     'Техника, электроника' => 'electronics',

        //     // Красота и здоровье
        //     'Красота, здоровье' => 'beauty_health',
        //     'Здоровый образ жизни' => 'healthy_lifestyle',
        //     'Стиль, одежда, обувь' => 'fashion',
        //     'Уход за собой' => 'self_care',

        //     // Музыка (жанры)
        //     'R&B' => 'rnb',
        //     'Rap, Hip-Hop' => 'hiphop',
        //     'Блюз' => 'blues',
        //     'Джаз' => 'jazz',
        //     'Классическая музыка' => 'classical',
        //     'Метал' => 'metal',
        //     'Рок' => 'rock',
        //     'Электронная музыка' => 'electronic',

        //     // Сообщества
        //     'Благотворительность' => 'charity',
        //     'Дискуссионный клуб' => 'discussion_club',
        //     'Фан-сообщество' => 'fandom',

        //     // Отношения
        //     'Знакомства' => 'dating',
        //     'Родители и дети' => 'parenting',

        //     // Развлечения
        //     'Кино' => 'movies',
        //     'Литература' => 'literature',
        //     'Юмор' => 'humor',

        //     // Спорт
        //     'Футбол' => 'football',
        //     'Киберспорт' => 'esports',
        //     'Фитнес' => 'fitness',

        //     // Хобби
        //     'Фотография' => 'photography',
        //     'Языки' => 'languages',
        //     'Наука' => 'science'
        // ];

        // foreach ($categories as $name => $code) {
        //     Topic::create([
        //         'name' => $name,
        //         'code' => $code,
        //         'updated_at' => null,
        //     ]);
        // }
    }
}
