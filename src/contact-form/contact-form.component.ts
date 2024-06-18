import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../contact.service';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnChanges {
  @Input() contact!: Contact;
  @Output() save = new EventEmitter<Contact>();
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && this.contact) {
      this.contactForm.patchValue({
        firstName: this.contact.firstName,
        lastName: this.contact.lastName,
        email: this.contact.email
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }

    const formValue = this.contactForm.value;
    const contactToSave: Contact = {
      id: this.contact.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email
    };

    if (this.contact.id === 0) {
      this.contactService.createContact(contactToSave).subscribe(
        savedContact => this.save.emit(savedContact)
      );
    } else {
      this.contactService.updateContact(this.contact.id, contactToSave).subscribe(
        savedContact => this.save.emit(savedContact)
      );
    }
  }
}
