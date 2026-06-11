<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tickets = [
            ['title' => 'Laptop tidak bisa menyala', 'category' => 'Hardware', 'priority' => 'High', 'status' => 'Open', 'assigned_person' => 'Budi Santoso'],
            ['title' => 'Koneksi internet lambat di lantai 2', 'category' => 'Network', 'priority' => 'Medium', 'status' => 'In Progress', 'assigned_person' => 'Andi Wijaya'],
            ['title' => 'Lupa password email kantor', 'category' => 'Access', 'priority' => 'Low', 'status' => 'Resolved', 'assigned_person' => 'Siti Rahayu'],
            ['title' => 'Printer error saat cetak dokumen', 'category' => 'Hardware', 'priority' => 'Medium', 'status' => 'Open', 'assigned_person' => 'Budi Santoso'],
            ['title' => 'Software akuntansi crash', 'category' => 'Software', 'priority' => 'Critical', 'status' => 'In Progress', 'assigned_person' => 'Andi Wijaya'],
            ['title' => 'Akses VPN tidak bisa terhubung', 'category' => 'Network', 'priority' => 'High', 'status' => 'Open', 'assigned_person' => 'Andi Wijaya'],
            ['title' => 'Monitor bergaris di bagian tengah', 'category' => 'Hardware', 'priority' => 'Low', 'status' => 'Closed', 'assigned_person' => 'Siti Rahayu'],
            ['title' => 'Instalasi Microsoft Office baru', 'category' => 'Software', 'priority' => 'Low', 'status' => 'Resolved', 'assigned_person' => 'Budi Santoso'],
        ];

        foreach ($tickets as $ticket) {
            \App\Models\Ticket::create($ticket);
        }
    }
}
