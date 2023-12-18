using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using StackExchange.Redis;
using System.Xml.Linq;
using System.Data;
using RawRabbit.Pipe.Middleware;
using System.Numerics;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Remotion.Linq.Clauses;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = await _userRepository.GetByIdAsync(Id);
            var videoUrl = "";
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);
            var CvUrl = string.IsNullOrWhiteSpace(profile.CvName) ? "" : await _fileService.GetFileURL(profile.CvName, FileType.UserCV);
            List<AddLanguageViewModel> LanguageList = new List<AddLanguageViewModel>();
            foreach(var language in profile.Languages)
                    {
                        var languagelist = new AddLanguageViewModel
                        {
                            Name = language.Language,
                            Id = language.Id,
                            Level = language.LanguageLevel,
                            CurrentUserId = language.UserId
                        };
                        LanguageList.Add(languagelist);  
                    }
            var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
            var education = profile.Education.Select(x => ViewModelFromEducation(x)).ToList();
            var certification = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
            var experience = profile.Experience.Select(x => ViewModelFromExperience(x)).ToList();
            var result = new TalentProfileViewModel
            {
                Id = profile.Id,
                FirstName = profile.FirstName,
                MiddleName = profile.MiddleName,
                LastName = profile.LastName,
                Gender = profile.Gender,
                Email = profile.Email,
                Phone = profile.Phone,
                MobilePhone = profile.MobilePhone,
                IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                Address = profile.Address,
                Nationality = profile.Nationality,
                VisaStatus = profile.VisaStatus,
                VisaExpiryDate = profile.VisaExpiryDate,
                ProfilePhoto = profile.ProfilePhoto,
                ProfilePhotoUrl = profile.ProfilePhotoUrl,
                VideoName = profile.VideoName,
                VideoUrl = videoUrl,
                CvName = profile.CvName,
                CvUrl = CvUrl,
                Summary = profile.Summary,
                Description = profile.Description,
                LinkedAccounts = profile.LinkedAccounts,
                JobSeekingStatus = profile.JobSeekingStatus,
                Languages = LanguageList,
                Skills = skills,
                Education = education,
                Certifications = certification,
                Experience = experience
            };
            return result;
        }
       
        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel profile, string updaterId)
        {
             
            try
            {
                if (profile.Id != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(profile.Id));
                    existingTalent.FirstName = profile.FirstName;
                    existingTalent.MiddleName = profile.MiddleName;
                    existingTalent.LastName = profile.LastName;
                    existingTalent.Gender = profile.Gender;
                    existingTalent.Email = profile.Email;
                    existingTalent.Phone = profile.Phone;
                    existingTalent.MobilePhone = profile.MobilePhone;
                    existingTalent.IsMobilePhoneVerified = profile.IsMobilePhoneVerified;
                    existingTalent.Address = profile.Address;
                    existingTalent.Nationality = profile.Nationality;
                    existingTalent.VisaStatus = profile.VisaStatus;
                    existingTalent.VisaExpiryDate = profile.VisaExpiryDate;
                    existingTalent.ProfilePhoto = profile.ProfilePhoto;
                    existingTalent.ProfilePhotoUrl = profile.ProfilePhotoUrl;
                    existingTalent.VideoName = profile.VideoName;
                    existingTalent.CvName = profile.CvName;
                    existingTalent.Summary = profile.Summary;
                    existingTalent.Description = profile.Description;
                    existingTalent.LinkedAccounts = profile.LinkedAccounts;
                    existingTalent.JobSeekingStatus = profile.JobSeekingStatus;

                    var newSkills = existingTalent.Skills;
                        foreach (var item in profile.Skills)
                        {
                                var skill = existingTalent.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false,
                                        UserId = profile.Id,
                                        Skill = item.Name,
                                        ExperienceLevel = item.Level,

                                    };
                                    newSkills.Add(skill);
                                }
                                if (skill != null)
                                {
                                    UpdateSkillFromView(item, skill);
                                
                                }
                        }
                    var newLanguages = existingTalent.Languages;
                        foreach (var item in profile.Languages)
                        {
                            var language = existingTalent.Languages.SingleOrDefault(x => x.Id == item.Id);
                            if (language == null)
                            {
                                language = new UserLanguage
                                {
                                    Id = ObjectId.GenerateNewId().ToString(),
                                    IsDeleted = false,
                                    UserId = profile.Id,
                                    Language = item.Name,
                                    LanguageLevel = item.Level,
                                };
                            newLanguages.Add(language);
                            }
                            if (language != null)
                            {
                            UpdateLanguageFromView(item, language);
                            }
                        }
                    var newEducation = existingTalent.Education;
                    foreach (var item in profile.Education)
                    {
                        var education = existingTalent.Education.SingleOrDefault(x => x.Id == item.Id);
                        if (education == null)
                        {
                            education = new UserEducation
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false,
                                UserId = profile.Id,
                                InstituteName = item.InstituteName,
                                Country = item.Country,
                                Title = item.Title,
                                Degree = item.Degree,
                                YearOfGraduation = item.YearOfGraduation,
                                CreatedOn = DateTime.UtcNow,
                                CreatedBy = profile.Id,
                                UpdatedBy = profile.Id,
                                UpdatedOn = DateTime.UtcNow,
                            };
                            newEducation.Add(education);
                        }
                        if(education != null)
                        {
                            UpdateEducationFromView(item, education);
                        }         
                    }
                    var newCertification = existingTalent.Certifications; 
                    foreach (var item in profile.Certifications)
                    {
                        var certification = existingTalent.Certifications.SingleOrDefault(x => x.Id == item.Id);
                        if (certification == null)
                        {
                            certification = new UserCertification
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                IsDeleted = false,
                                UserId = profile.Id,
                                CertificationName = item.CertificationName,
                                CertificationFrom = item.CertificationFrom,
                                CertificationYear = item.CertificationYear,
                                CreatedOn = DateTime.UtcNow,
                                CreatedBy = profile.Id,
                                UpdatedBy = profile.Id,
                                UpdatedOn = DateTime.UtcNow,

                            };
                            newCertification.Add(certification);
                        }
                        if(certification != null)
                        {
                            UpdateCertificationFromView(item, certification);
                        }
                    }
                    var newExperience = existingTalent.Experience;
                    foreach (var item in profile.Experience)
                    {
                        var experience = existingTalent.Experience.SingleOrDefault(x => x.Id == item.Id);
                        if (experience == null)
                        {
                            experience = new UserExperience
                            {
                                Id = ObjectId.GenerateNewId().ToString(),
                                Company = item.Company,
                                Position = item.Position,
                                Responsibilities = item.Responsibilities,
                                Start = item.Start,
                                End = item.End,
                            };
                            newExperience.Add(experience);
                        }
                        if(experience != null)
                        {
                            UpdateExperienceFromView(item, experience);
                        }
                        ;

                    }
                    existingTalent.Skills = newSkills;
                    existingTalent.Languages = newLanguages;
                    existingTalent.Education = newEducation;
                    existingTalent.Certifications = newCertification;
                    await _userRepository.Update(existingTalent);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }
        public async Task<bool> DeleteLanguage(string languageId, string profileId)
        {
            if (languageId != null || languageId != "0")
            {
                User existingTalent = (await _userRepository.GetByIdAsync(profileId));
                UserLanguage existingLanguage = existingTalent.Languages.FirstOrDefault(s => s.Id == languageId);
                if (existingTalent == null)
                {
                    return false;
                }
                existingTalent.Languages.RemoveAll(x => x.Id == existingLanguage.Id);
                await _userRepository.Update(existingTalent);
                
                return true;
            }
            else { return false; }
        }
        public async Task<bool> DeleteSkill(string SkillId, string profileId)
        {
            if (SkillId != null || SkillId != "0")
            {
                User existingTalent = (await _userRepository.GetByIdAsync(profileId));
                UserSkill existingSkill = existingTalent.Skills.FirstOrDefault(s => s.Id == SkillId);
                if (existingTalent == null)
                {
                    return false;
                }
                existingTalent.Skills.RemoveAll(x => x.Id == existingSkill.Id);
                await _userRepository.Update(existingTalent);

                return true;
            }
            else { return false; }
        }
        public async Task<bool> DeleteExperience(string ExperienceId, string profileId)
        {
            if (ExperienceId != null || ExperienceId != "0")
            {
                User existingTalent = (await _userRepository.GetByIdAsync(profileId));
                UserExperience existingExperience = existingTalent.Experience.FirstOrDefault(s => s.Id == ExperienceId);
                if (existingTalent == null)
                {
                    return false;
                }
                existingTalent.Experience.RemoveAll(x => x.Id == existingExperience.Id);
                await _userRepository.Update(existingTalent);

                return true;
            }
            else { return false; }
        }
        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }
        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage orginal) 
        {
            orginal.Language = model.Name;
            orginal.LanguageLevel = model.Level;
        }
        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation orginal)
        {
            orginal.InstituteName = model.InstituteName;
            orginal.Country = model.Country;
            orginal.Title = model.Title;
            orginal.Degree = model.Degree;
            orginal.YearOfGraduation = model.YearOfGraduation;
            orginal.UpdatedOn = DateTime.UtcNow;
            orginal.UpdatedBy = model.Id;
        }
        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification orginal)
        {
            orginal.CertificationName = model.CertificationName;
            orginal.CertificationFrom = model.CertificationFrom;
            orginal.CertificationYear = model.CertificationYear;
            orginal.UpdatedOn = DateTime.UtcNow;
            orginal.UpdatedBy = model.Id;
        }
        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience orginal)
        {
            orginal.Company = model.Company;
            orginal.Position = model.Position;
            orginal.Responsibilities = model.Responsibilities;
            orginal.Start = model.Start;
            orginal.End = model.End ;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Country = education.Country,
                InstituteName = education.InstituteName,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                Id = education.Id,
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationFrom = certification.CertificationFrom,
                CertificationName = certification.CertificationName,
                CertificationYear = certification.CertificationYear,
            };
        }
        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End,
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
