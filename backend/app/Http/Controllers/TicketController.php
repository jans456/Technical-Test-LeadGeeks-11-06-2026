<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Ticket::latest()->get());
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total'       => Ticket::count(),
            'open'        => Ticket::where('status', 'Open')->count(),
            'in_progress' => Ticket::where('status', 'In Progress')->count(),
            'high_priority' => Ticket::whereIn('priority', ['High', 'Critical'])->count(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'           => 'required|string|max:255',
            'requester_name'  => 'nullable|string|max:100',
            'category'        => 'required|string|max:100',
            'priority'        => 'required|in:Low,Medium,High,Critical',
            'status'          => 'sometimes|in:Open,In Progress,Resolved,Closed',
            'assigned_person' => 'sometimes|string|max:100',
        ]);

        $data['status'] = $data['status'] ?? 'Open';
        $data['assigned_person'] = $data['assigned_person'] ?? 'Belum Ditugaskan';

        $ticket = Ticket::create($data);
        return response()->json($ticket, 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(Ticket::findOrFail($id));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        $data = $request->validate([
            'title'           => 'sometimes|required|string|max:255',
            'requester_name'  => 'sometimes|nullable|string|max:100',
            'category'        => 'sometimes|required|string|max:100',
            'priority'        => 'sometimes|required|in:Low,Medium,High,Critical',
            'status'          => 'sometimes|required|in:Open,In Progress,Resolved,Closed',
            'assigned_person' => 'sometimes|required|string|max:100',
        ]);

        $ticket->update($data);
        return response()->json($ticket);
    }

    public function destroy(string $id): JsonResponse
    {
        Ticket::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
