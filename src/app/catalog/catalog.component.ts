import { Component, OnInit } from '@angular/core';

import { UserRepositoryService } from 'app/core/user-repository.service';
import { CatalogRepositoryService } from './catalog-repository.service';
import { FilterClassesService } from './filter-classes.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  classes: any[];
  visibleClasses: any[];
  orderByField: string;

  constructor(
    private userRepository: UserRepositoryService,
    private catalogRepository: CatalogRepositoryService,
    private filterClassesService: FilterClassesService
  ) {}


  ngOnInit() {
    this.catalogRepository.getCatalog().subscribe(classes => {
      this.classes = classes;
      this.applyFilter('');
    });
  }

  mutateFirstProfessor() {
    this.visibleClasses[0].professor = 'Zebraman';
  }

  updateFirstProfessor() {
    this.visibleClasses = [
      Object.assign(this.visibleClasses[0], { professor: 'Zebraman' }),
      ...this.visibleClasses.slice(1)
    ];
  }

  enroll(classToEnroll) {
    classToEnroll.processing = true;
    this.userRepository.enroll(classToEnroll.classId).subscribe(
      null,
      err => {
        console.error(err);
        classToEnroll.processing = false;
      }, // add a toast message or something
      () => {
        classToEnroll.processing = false;
        classToEnroll.enrolled = true;
      }
    );
  }

  drop(classToDrop) {
    classToDrop.processing = true;
    this.userRepository.drop(classToDrop.classId).subscribe(
      null,
      err => {
        console.error(err);
        classToDrop.processing = false;
      }, // add a toast message or something
      () => {
        classToDrop.processing = false;
        classToDrop.enrolled = false;
      }
    );
  }

  applyFilter(filter) {
    this.visibleClasses = this.filterClassesService.filterClasses(
      filter,
      this.classes
    );
  }
}
