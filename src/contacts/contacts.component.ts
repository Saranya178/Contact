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
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe(
      data => this.contacts = data,
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
      });
    }
  }

  onContactSaved(contact: Contact): void {
    this.loadContacts();
    this.selectedContact = null;
  }
}
