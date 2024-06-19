import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedContact: Contact | null = null;
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe(
      data => {
        this.contacts = data;
        this.applyFilters();
      },
      error => console.error(error)
    );
  }

  onSelect(contact: Contact): void {
    this.selectedContact = contact;
  }

  onDelete(contact: Contact): void {
    if (confirm(`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`)) {
      this.contactService.deleteContact(contact.id).subscribe(() => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.applyFilters();
      });
    }
  }

  onContactSaved(contact: Contact): void {
    this.loadContacts();
    this.selectedContact = null;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.contacts;

    if (this.searchQuery) {
      filtered = filtered.filter(contact =>
        contact.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[this.sortColumn as keyof Contact];
        const bValue = b[this.sortColumn as keyof Contact];
        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        } else if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.filteredContacts = filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }
}
