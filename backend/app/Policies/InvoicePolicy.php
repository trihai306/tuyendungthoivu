<?php

namespace App\Policies;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    /**
     * Determine whether the user can view any invoices.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('invoices.view');
    }

    /**
     * Determine whether the user can create invoices.
     */
    public function create(User $user): bool
    {
        return $user->hasPermission('invoices.create');
    }

    /**
     * Determine whether the user can update the invoice.
     * Only draft invoices can be edited.
     */
    public function update(User $user, Invoice $invoice): bool
    {
        if (!$user->hasPermission('invoices.edit')) {
            return false;
        }

        return $invoice->status === InvoiceStatus::Draft;
    }

    /**
     * Determine whether the user can delete the invoice.
     * Only draft invoices can be deleted.
     */
    public function delete(User $user, Invoice $invoice): bool
    {
        if (!$user->hasPermission('invoices.delete')) {
            return false;
        }

        return $invoice->status === InvoiceStatus::Draft;
    }

    /**
     * Determine whether the user can send the invoice to the client.
     */
    public function send(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission('invoices.send');
    }
}
