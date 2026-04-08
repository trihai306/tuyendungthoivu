<?php

namespace App\Listeners;

use App\Models\Review;
use App\Models\Worker;
use Illuminate\Contracts\Queue\ShouldQueue;

class RecalculateWorkerRating implements ShouldQueue
{
    /**
     * Recalculate a worker's average rating when a new review is submitted.
     * This listener should be triggered by a ReviewCreated or ReviewUpdated event.
     * It queries all reviews for the worker's linked user and updates the average.
     */
    public function handle(object $event): void
    {
        // Support both a direct Worker model or an event with a review property
        $worker = $this->resolveWorker($event);

        if (!$worker) {
            return;
        }

        // Calculate the average rating from all reviews for this worker's user
        if ($worker->user_id) {
            $averageRating = Review::where('reviewee_id', $worker->user_id)
                ->avg('rating');

            $worker->update([
                'average_rating' => round($averageRating ?? 0, 1),
            ]);
        }
    }

    /**
     * Resolve the Worker model from various event shapes.
     */
    private function resolveWorker(object $event): ?Worker
    {
        // If the event carries a Worker directly
        if (isset($event->worker) && $event->worker instanceof Worker) {
            return $event->worker;
        }

        // If the event carries a Review, find the associated worker
        if (isset($event->review) && $event->review instanceof Review) {
            return Worker::where('user_id', $event->review->reviewee_id)->first();
        }

        return null;
    }
}
